import os
import json
from typing import List, Tuple, Optional
from dotenv import load_dotenv
import vertexai
from vertexai.preview import rag
from vertexai.preview.generative_models import GenerativeModel, Tool, ChatSession, SafetySetting, HarmCategory, HarmBlockThreshold
from pathlib import Path

class RAGChatbot:
    def __init__(self):
        # Load environment variables
        env_path = Path(__file__).parent.parent.parent / '.env'
        load_dotenv(env_path)
        
        # Initialize Vertex AI settings
        self.project_id = os.getenv("PROJECT_ID")
        self.location = os.getenv("GOOGLE_CLOUD_REGION", "us-central1")
        self.embedding_model = os.getenv("EMBEDDING_MODEL")
        self.base_bucket = os.getenv("INPUT_GCS_BUCKET_BASE")
        
        print("Initializing Vertex AI...")
        vertexai.init(project=self.project_id, location=self.location)
        
        # Initialize a default model for stance analysis with adjusted safety settings
        print("Setting up default model...")
        safety_settings=[
            SafetySetting(category=HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold=HarmBlockThreshold.BLOCK_NONE),
            SafetySetting(category=HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold=HarmBlockThreshold.BLOCK_NONE),
            SafetySetting(category=HarmCategory.HARM_CATEGORY_HARASSMENT, threshold=HarmBlockThreshold.BLOCK_NONE),
            SafetySetting(category=HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold=HarmBlockThreshold.BLOCK_NONE)
        ]
        self.default_model = GenerativeModel("gemini-1.5-flash-001", safety_settings=safety_settings)
        
        # Initialize conversation context
        self.stance = None
        self.subject = None
        self.chat_session = None
        self.is_first_message = True
        
        print("RAG Chatbot initialized successfully!")

    def analyze_stance(self, text: str) -> Tuple[str, str]:
        """Analyze the stance and subject from user input"""
        try:
            print("Analyzing stance...")
            chat = self.default_model.start_chat()
            
            prompt = f"""You must return ONLY a JSON object with no other text, markdown, or formatting.
            Analyze this text: '{text}'
            
            Schema:
            {{'stance': str,  // must be 'for' or 'against'
            'subject': str  // must be 'abortion', 'gun_laws', 'immigration', 'artificial_intelligence_regulation', 'universal_basic_income', 'universal_healthcare', 'gene_editing'
            }}"""
            
            response = chat.send_message(prompt, stream=False)
            
            # Clean the response text by removing markdown code fences
            cleaned_response = response.text.strip()
            if cleaned_response.startswith('```'):
                cleaned_response = cleaned_response.split('```')[1]
            if cleaned_response.startswith('json'):
                cleaned_response = cleaned_response[4:]
            cleaned_response = cleaned_response.strip()
            
            print(f"Raw stance analysis response: {cleaned_response}")
            
            result = json.loads(cleaned_response)
            
            # Flip the stance to generate counter-argument
            stance = "against" if result['stance'] == "for" else "for"
            print(f"Detected stance: {stance}, subject: {result['subject']}")
            return stance, result['subject']
            
        except Exception as e:
            print(f"Error in stance analysis: {e}")
            return "neutral", "general"

    def setup_rag_corpus(self, subject: str, stance: str) -> Optional[str]:
        """Set up the RAG corpus with document embeddings"""
        try:
            print(f"Setting up RAG corpus for {stance} {subject}...")
            
            # Create embedding model configuration
            embedding_model_config = rag.EmbeddingModelConfig(
                publisher_model=self.embedding_model
            )
            
            # Create corpus
            corpus = rag.create_corpus(
                display_name=f"cli-rag-corpus-{subject}-{stance}".lower(),
                embedding_model_config=embedding_model_config
            )
            
            # Construct paths
            subject_path = os.path.join(self.base_bucket, subject.lower())
            stance_bucket = os.path.join(subject_path, stance.lower())
            neutral_bucket = os.path.join(subject_path, "neutral")
            
            print(f"Importing documents from: {[stance_bucket, neutral_bucket]}")
            
            # Import documents from GCS buckets
            rag.import_files(
                corpus_name=corpus.name,
                paths=[stance_bucket, neutral_bucket],
                chunk_size=1024,
                chunk_overlap=100,
                max_embedding_requests_per_min=900,
            )
            
            return corpus.name
            
        except Exception as e:
            print(f"Error setting up RAG corpus: {e}")
            return None

    def setup_chat_session(self, corpus_name: Optional[str] = None) -> ChatSession:
        """Initialize the chat session with RAG capability"""
        try:
            print("Setting up chat session...")
            if corpus_name:
                # Create RAG retrieval tool
                retrieval_tool = Tool.from_retrieval(
                    retrieval=rag.Retrieval(
                        source=rag.VertexRagStore(
                            rag_corpora=[corpus_name],
                            similarity_top_k=5,
                            vector_distance_threshold=0.5,
                        ),
                    )
                )
                
                # Initialize model with RAG and adjusted safety settings
                safety_settings=[
                    SafetySetting(category=HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold=HarmBlockThreshold.BLOCK_NONE),
                    SafetySetting(category=HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold=HarmBlockThreshold.BLOCK_NONE),
                    SafetySetting(category=HarmCategory.HARM_CATEGORY_HARASSMENT, threshold=HarmBlockThreshold.BLOCK_NONE),
                    SafetySetting(category=HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold=HarmBlockThreshold.BLOCK_NONE)
                ]
                
                model = GenerativeModel(
                    "gemini-1.5-flash-001",
                    tools=[retrieval_tool],
                    safety_settings=safety_settings
                )
            else:
                model = self.default_model
            
            return model.start_chat(response_validation=False)
            
        except Exception as e:
            print(f"Error setting up chat session: {e}")
            return self.default_model.start_chat()

    def get_response(self, message: str, stream: bool = True) -> str:
        """Get response from the model with optional streaming"""
        try:
            print("\nProcessing message...")
            
            # Only analyze stance and set up RAG for first message
            if self.is_first_message:
                self.stance, self.subject = self.analyze_stance(message)
                print(f"Setting initial context - Stance: {self.stance}, Subject: {self.subject}")
                
                # Set up RAG corpus and chat session
                corpus_name = self.setup_rag_corpus(self.subject, self.stance)
                self.chat_session = self.setup_chat_session(corpus_name)
                self.is_first_message = False
                
                # Construct initial roleplay prompt
                prompt = f"""Roleplay as if you are someone who has done a lot of research in
                this area. You are allowed to discuss policy, because all these subjects are not inflammatory. 
                Explain why you are {self.stance} {self.subject}.  Argue it in first person. 
                Make sure to expand on your argument and cite claims ONLY with documents that have been provided.
                ALWAYS REITERATE YOUR POSITION. Explain why you are {self.stance} {self.subject}. 
                Do NOT explicitly say the phrase 'some people' or 'some sources'. 
                Limit responses to 250 words.
                """
            else:
                # Use the message as is for subsequent interactions
                prompt = message
            
            print("Generating response...")
            # Get model response
            responses = self.chat_session.send_message(prompt, stream=stream)
            
            if stream:
                # Stream the response
                response_text = []
                print("\nBot: ", end="", flush=True)
                for chunk in responses:
                    if chunk.text:
                        print(chunk.text, end="", flush=True)
                        response_text.append(chunk.text)
                print("\n")
                return "".join(response_text)
            else:
                # Return complete response
                return responses.text
                
        except Exception as e:
            print(f"\nError getting response: {e}")
            return f"Error: {str(e)}"

class ChatSessionManager:
    def __init__(self):
        self.chatbot = RAGChatbot()
        self.stream_enabled = True

    def send_message(self, message: str) -> str:
        if message.lower() == 'quit':
            return "Ending chat session. Goodbye!"
        elif message.lower() == 'stream off':
            self.stream_enabled = False
            return "Streaming disabled."
        elif message.lower() == 'stream on':
            self.stream_enabled = True
            return "Streaming enabled."
        else:
            return self.chatbot.get_response(message, stream=self.stream_enabled)

if __name__ == "__main__":
    try:
        # Initialize the chat session manager
        print("Initializing RAG chatbot...")
        session_manager = ChatSessionManager()
        
        print("\nChat session started! Type 'quit' to exit.")
        print("Type 'stream off' to disable response streaming.")
        print("Type 'stream on' to enable response streaming.")
        
        # Chat loop
        while True:
            # Get user input
            user_input = input("\nYou: ").strip()
            
            # Get and display response
            response = session_manager.send_message(user_input)
            if response == "Ending chat session. Goodbye!":
                print(response)
                break
            else:
                print(f"\nBot: {response}")

    except KeyboardInterrupt:
        print("\n\nChat session interrupted. Goodbye!")
    except Exception as e:
        print(f"\nError in chat session: {e}")