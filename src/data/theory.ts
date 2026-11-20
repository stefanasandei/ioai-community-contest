// Matches the IOAI 2027 syllabus hierarchy. Add lessons in src/theory/<id>.mdx.
export type SyllabusMode = 'Theory' | 'Practice' | 'Both';
export type TheoryResource = { label: string; url: string };
export type TheoryTask = { label: string; url: string };
export type TheoryTopic = { id: string; title: string; mode: SyllabusMode; resources?: TheoryResource[]; task?: TheoryTask };
export type TheoryCategory = { title: string; topics: TheoryTopic[]; supplementary?: boolean };
export type TheorySection = { id: string; title: string; accent: string; categories: TheoryCategory[] };

const slug = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

// Fill these in as you curate each topic. The key is the topic's generated ID.
export const topicDetails: Record<string, { resources?: TheoryResource[]; task?: TheoryTask }> = {
  // 'linear-regression': {
  //   resources: [{ label: 'A good explanation', url: 'https://example.org' }],
  //   task: { label: 'AICC practice problem', url: '/tasks' },
  // },
};

const category = (title: string, lines: string, supplementary = false): TheoryCategory => ({
  title,
  supplementary,
  topics: lines.trim().split('\n').map(line => {
    const [name, mode] = line.trim().split('|');
    const id = slug(name);
    return { id, title: name, mode: mode as SyllabusMode, ...topicDetails[id] };
  }),
});

export const syllabusUrl = 'https://ioai-official.org/wp-content/uploads/2026/11/IOAI_Syllabus.pdf';

export const theorySections: TheorySection[] = [
  { id: 'foundational-skills-classical-machine-learning', title: 'Foundational Skills & Classical Machine Learning', accent: 'blue', categories: [
    category('Introduction to Mathematics', `Algebra & Mathematical Foundations I|Theory
Algebra & Mathematical Foundations II|Theory
Combinatorics|Theory
Linear Algebra I|Theory
Linear Algebra II|Theory
Linear Algebra (optional)|Theory
Calculus I|Theory
Calculus II|Theory
Probability Theory|Theory
Statistics & Information Theory I|Theory
Statistics & Information Theory II|Theory`, true),
    category('Programming Fundamentals', `Python Basics (Loops, Functions, etc.)|Practice
NumPy and Pandas for Data Handling|Practice
Matplotlib and Seaborn for Visualization|Practice
Scikit-learn for ML|Practice
PyTorch Basics|Practice
Tensor (Multi-dimensional Array) Manipulation|Practice
Training Models on CPU and GPU|Practice`),
    category('Supervised Learning', `Linear Regression|Both
Logistic Regression|Both
L1 & L2 Regularization|Both
K-Nearest Neighbors (K-NN)|Both
Decision Trees|Both
Model Ensembles (Gradient Boosting, Bagging, Random Forest)|Practice
Support Vector Machines (SVM)|Both`),
    category('Unsupervised Learning', `K-Means Clustering|Both
Principal Component Analysis (PCA)|Both
t-SNE, UMAP|Practice
DBSCAN, Hierarchical & Spectral Clustering|Practice`),
    category('Data Science Fundamentals', `Model Evaluation Metrics (Accuracy, Precision, Recall, F1-Score, etc.)|Both
Underfitting, Overfitting|Theory
Hyperparameter Tuning|Practice
Cross-Validation|Practice
Confusion Matrix and ROC Curves|Both
Feature Engineering|Practice
Data Processing|Practice`),
    category('Technical Fundamentals', `Basic Linux terminal commands|Practice
Jupyter Notebook / JupyterLab|Practice
Basic Git|Practice
Work on remote servers (via SSH)|Practice`),
  ] },
  { id: 'neural-networks-deep-learning', title: 'Neural Networks & Deep Learning', accent: 'purple', categories: [
    category('Neural Networks', `Perceptron Basics|Both
Gradient Descent|Both
Backpropagation|Both
Activation Functions (ReLU, Sigmoid, Tanh)|Both
Loss Functions (MSE, MAE, Cross Entropy, etc.)|Both`),
    category('Deep Learning', `Multi-Layer Perceptrons (MLP)|Both
Data Embeddings (text, image, audio)|Both
Pooling Techniques (Max, Average)|Both
Attention Mechanism|Both
Transformers (theory needed only for text and image)|Both
Autoencoders|Practice
SGD, Mini-Batch Gradient Descent|Both
Momentum Methods (Adam, AdamW)|Practice
Convergence and Learning Rates|Practice
Regularization: Dropout, Early Stopping, Weight Decay|Practice
Weight Initialization|Practice
Batch Normalization|Practice
Full and Parameter-efficient Finetuning Methods|Practice`),
  ] },
  { id: 'computer-vision', title: 'Computer Vision', accent: 'orange', categories: [
    category('Fundamentals', `Convolutional Layers|Both
Image Classification|Practice
Object Detection (YOLO, SSD, DETR)|Practice
Image Segmentation (U-Net)|Practice
Pre-trained Vision Encoders (e.g. ResNet)|Practice
Image Augmentation Techniques|Practice
Generating Images with GANs|Practice
Self-Supervised Learning for Vision|Practice
Vision-text encoders (e.g. CLIP)|Practice
Diffusion Models|Practice`),
  ] },
  { id: 'natural-language-processing-audio', title: 'Natural Language Processing & Audio', accent: 'teal', categories: [
    category('NLP', `Text Classification|Practice
Sequence-to-Sequence tasks|Practice
Pre-trained Text Encoders|Both
Language Modeling|Both
Text Decoders (conditional generation)|Practice
Pre-trained Language Models: Open-source and Closed-source (API-based)|Practice`),
    category('Audio Processing', `Pre-trained Audio Encoders: HuBERT|Practice
Audio Models: Qwen-Audio, Whisper, Voxtral|Practice`),
  ] },
  { id: 'basics-of-reinforcement-learning', title: 'Basics of Reinforcement Learning', accent: 'pink', categories: [
    category('Reinforcement Learning', `Agent–Environment Loop (States, Actions, Rewards, Episodes)|Both
Policies, Returns and the Discount Factor|Both
State-Value and Action-Value Functions (V, Q)|Both
Q-learning, DQN, REINFORCE|Practice`),
  ] },
];

export const allTheoryTopics = theorySections.flatMap(section => section.categories.flatMap(group => group.topics));
export const topicCount = allTheoryTopics.length;
