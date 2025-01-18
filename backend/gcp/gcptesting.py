import os
import json
from dotenv import load_dotenv
import vertexai
from vertexai.preview import rag
from vertexai.preview.generative_models import GenerativeModel, Tool, ChatSession
from vertexai.preview.generative_models import SafetySetting, HarmCategory, HarmBlockThreshold
from pathlib import Path

env_path = Path(__file__).parent.parent.parent / '.env'
load_dotenv(env_path)

# Set the Google Cloud credentials
os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = os.getenv("GOOGLE_APPLICATION_CREDENTIALS")


def analyze_argument(text):
    PROJECT_ID = os.getenv("PROJECT_ID")
    LOCATION = os.getenv("GOOGLE_CLOUD_REGION", "us-central1")
    MODEL_ID = "gemini-1.5-flash-001" 

    vertexai.init(project=PROJECT_ID, location=LOCATION)

    gemini_model = GenerativeModel(MODEL_ID)

    prompt = f"""Analyze this text and return JSON only: '{text}'
    
    Use this schema:
    {{'stance': str,  // must be 'for' or 'against'
      'subject': str  // must be a noun or noun phrase
    }}
    
    Return valid JSON only, no other text."""

    chat_session = gemini_model.start_chat()
    response = chat_session.send_message(prompt, stream=False)
    
    try:
        result = json.loads(response.text)
        
        stance = result['stance']
        subject = result['subject']
        
        if stance == "for":
            stance = "against"
        else:
            stance = "for"
            
        return stance.strip(), subject.strip()
        
    except json.JSONDecodeError as e:
        print(f"Error parsing JSON response: {e}")
        return None, None
    except KeyError as e:
        print(f"Missing required field in JSON response: {e}")
        return None, None


def generate_argument(stance, subject, stream=False):
    PROJECT_ID = os.getenv("PROJECT_ID")
    LOCATION = os.getenv("GOOGLE_CLOUD_REGION", "us-central1")
    EMBEDDING_MODEL = os.getenv("EMBEDDING_MODEL")
    INPUT_GCS_BUCKET_BASE = os.getenv("INPUT_GCS_BUCKET_BASE")

    vertexai.init(project=PROJECT_ID, location=LOCATION)

    embedding_model_config = rag.EmbeddingModelConfig(publisher_model=EMBEDDING_MODEL)

    rag_corpus = rag.create_corpus(
        display_name="my-rag-corpus", embedding_model_config=embedding_model_config
    )

    INPUT_GCS_BUCKET_BASE += subject + "/"
    if stance == "for":
        INPUT_GCS_BUCKET_BIAS = INPUT_GCS_BUCKET_BASE + "for/"
    else:
        INPUT_GCS_BUCKET_BIAS = INPUT_GCS_BUCKET_BASE + "against/"
    INPUT_GCS_BUCKET_NEUTRAL = INPUT_GCS_BUCKET_BASE + "neutral/"

    response = rag.import_files(
        corpus_name=rag_corpus.name,
        paths=[INPUT_GCS_BUCKET_BIAS, INPUT_GCS_BUCKET_NEUTRAL],
        chunk_size=1024,  
        chunk_overlap=100,  
        max_embedding_requests_per_min=900,  
    )

    rag_retrieval_tool = Tool.from_retrieval(
        retrieval=rag.Retrieval(
            source=rag.VertexRagStore(
                rag_corpora=[rag_corpus.name],
                similarity_top_k=10,
                vector_distance_threshold=0.5,
            ),
        )
    )

    rag_gemini_model = GenerativeModel(
        "gemini-1.5-flash-001",  
        tools=[rag_retrieval_tool],
    )

    # Start a chat session
    chat_session = rag_gemini_model.start_chat(response_validation=False)

    def get_chat_response(chat: ChatSession, prompt: str) -> str:
        text_response = []
        responses = chat.send_message(prompt, stream=True)
        for chunk in responses:
            text_response.append(chunk.text)
            if stream:
                if chunk.text:
                    print(chunk.text, end='', flush=True)
        return "".join(text_response)

    prompt =  "Explain why some people are " + stance + " " + subject + """. Roleplay as if you are someone who has done a lot of research in
        this area. Argue it in first person. Make sure to expand on your argument and cite specific claims with sources from the documents.  
        Do NOT explicitly say the phrase 'some sources'.  Make sure to expand on your argument and cite specific claims with sources from the documents.
        """
    response_text = get_chat_response(chat_session, prompt)

    # if not stream:
    #     # Print the response text
    #     print(response_text)

    # Print the sources
    # print("\nSources:")
    # for grounding_chunk in response.candidates[0].grounding_metadata.grounding_chunks:
    #     print(f"- {grounding_chunk.retrieved_context.uri} ({grounding_chunk.retrieved_context.title})")

user_arg = input("Give your argument: ")
stance, subject = analyze_argument(user_arg)
print(f"Opposing stance: {stance}")
print(f"Detected subject: {subject}")
print("\nGenerating counter-argument...\n")

# Generate and return the counter-argument
MAX_RETRIES = 3

for attempt in range(MAX_RETRIES):
    try:
        generate_argument(stance, subject, stream=True)
        break
    except vertexai.generative_models._generative_models.ResponseValidationError:
        if attempt < MAX_RETRIES - 1:
            print(f"\nRetrying... (Attempt {attempt + 2}/{MAX_RETRIES})")
        else:
            print("\nFailed to generate a valid response after multiple attempts.")