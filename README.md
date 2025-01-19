# ⚖️ The Other Side

## 🎯 Breaking the Echo Chamber
Our mission is to present people with a place to test the validity of their beliefs and expose themselves to new ideas from reliable sources advocating for all sides of a topic. By leveraging advanced AI and a curated knowledge base, we aim to foster meaningful dialogue and deeper understanding across different viewpoints.

## 💡 Overview
The Other Side is a website and Chrome extension that revolutionizes how people engage with online content and controversial topics. Using a specialized RAG (Retrieval-Augmented Generation) model trained on peer-reviewed research papers and reputable sources, we provide users with:

- Real-time fact-checking and source verification
- Balanced perspectives on complex topics
- Access to academic research in digestible formats
- Interactive debate features with AI-powered moderation

Our platform helps break echo chambers by exposing users to well-researched, diverse viewpoints while maintaining high standards of intellectual rigor.

## ✨ Key Features
- **Interactive Debates**: Engage in educational discussions with real-time fact-checking and source verification
- **Webpage Analysis**: Challenge and verify information on any webpage with our Chrome extension
- **Source Library**: Access a comprehensive database of peer-reviewed research and credible sources
## 🎨 Design Philosophy
Our platform is built on three core principles:

1. **Transparency**: All data sources are openly available and verifiable
2. **Accessibility**: Complex topics are presented in understandable formats
3. **Neutrality**: Balanced presentation of different viewpoints with clear source attribution

## 🛠️ Technologies Used
### Frontend
- **React 19**: Core framework for building our user interface
- **Framer Motion**: Advanced animations and transitions

### Backend
- **Flask**: Python-based REST API
- **MongoDB**: Document storage for user data and cached sources
- **Google OAuth**: Secure user authentication
- **GCP (Google Cloud Platform)**: Cloud infrastructure and scaling
- **Vertex AI**: Large language model deployment and RAG implementation

### AI/ML Stack
- **Custom RAG Pipeline**: Built with Vertex AI

## ⬇️ Installation Instructions

1. Clone the repository and navigate to the frontend directory:
   ```bash
   cd frontend-new/
   ```

2. Install the necessary Node.js dependencies:

   ```bash
   npm install
   ```

3. Build the frontend application:

   ```bash
   npm run build
   ```

4. Navigate to the backend directory:

   ```bash
   cd ../backend
   ```

5. Install the required Python dependencies:

   ```bash
   pip install -r requirements.txt
   ```

6. Start the backend application:

   ```bash
   python app.py

## 🎯 Future Enhancements
- **Improved Data Curation**: Disagreements on some topics may stem from deeper systemic divides (e.g. religion, ethnicity), there are less research papers, not only on the subject as a whole, but for each side as well.
- **Knowledge Base Expansion**: Add more topics and sources while maintaining quality standards
- **Open Source Model**: Release model weights and training pipeline for community verification
- **Multimodal Integration**: Support for images, videos, and audio in discussions
- **Community Features**: Peer review system for user contributions
- **API Access**: Public API for researchers and developers

## 🤝 Contributing
We welcome contributions from the community! To contribute:
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Open a pull request
