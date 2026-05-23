This is a repository for the website of an AI contest. I want you to help me write a professional editorial for a given task. A good editorial teaches the important core concepts and gives thoughtful explanations. It's bad if you just drop the notebook code, the editorial needs to go deeper and explain the new approaches and ideas used to solve.

The editorials are stored as mdx in `./src/solutions`. After you write an editorial, add the blog field in `./src/data/contests.json`.

In case you need it for reference, the component used to render mdx files is `src/pages/Solution.tsx`. Use html for tables instead of markdown tables. Also use latex instead of unicode for math.

The task solution notebook can be found at `/home/stefan/Documents/aicc-solutions/round-1/defected-nuts.ipynb` (only read it).

This is the task statement:
```
Overview
This competition is organized by the IOAI Community Contest group (not affiliated with IOAI), which is made up of IOAI alumni.
It is meant to prepare students for the IOAI (International Olympiad in Artificial Intelligence).
Information about the task can be found below and the baseline.ipynb file is in the "Data" and "Code" sections.

Start

Nov 15, 2025
Close

Nov 16, 2025
Task
1. Task Description
You've been hired as the lead Computer Vision Engineer at Willy Wonka Factory, the chocolate company known for its premium quality standards. Your task is to improve the quality control system for hazelnuts, a key ingredient in their flagship chocolate bars.

Recent customer complaints have increased due to defective nuts slipping through inspection. The current automated sorting line uses a simple color threshold detector, but it's missing subtle defects like hairline cracks, tiny cuts, small holes, and faint print contamination from processing machines.

The factory floor needs a new detection system that can automatically flag defective hazelnuts at the pixel level.

2. Dataset
The structure of the provided hazelnut dataset is as follows:

data/
├── train/
│   └── 1.png, 2.png, ..., 431.png    # Normal hazelnut images
└── test/
    └── 1.png, 2.png, ..., 70.png     # Images with various defects
Dataset Specifications
Training Set (data/train/):

Contains 431 defect-free hazelnut images
Files named 1.png through 431.png
All images are RGB color images in PNG format
Resolution: 1024×1024 pixels
These are the only data available for training
Accessible during development
Test Set (data/test/):

Contains 70 images with various defects
Files named 1.png through 70.png
Same format and resolution as training images
Split internally 50/50 into:
Test A: Used for Leaderboard A scoring (visible)
Test B: Used for Leaderboard B scoring (final)
Defect Characteristics:

Types: Cracks, cuts, holes, print contamination
Defect range: 0.23%–28% of the image
3. Task
Develop a method that processes each test image and generates a pixel-level anomaly score map.

Input and Output
Input: RGB image of shape (1024, 1024, 3)
Output: Anomaly score map of shape (1024, 1024) with values in [0, 255]
0 = normal
255 = anomalous
Constraints
Pretrained Models: You may ONLY use a standard ResNet18 pretrained on ImageNet. Use is optional. No other pretrained models or datasets allowed.
  import torchvision.models as models
  resnet18 = models.resnet18(pretrained=True)
4. Submission
Submit submission.csv containing your predicted anomaly maps (Base85-encoded).

Format Requirements
File must be named submission.csv
Columns:
id — integer index matching sorted filenames (1.png, 2.png, …, 70.png)
data — Base85-encoded bytes of the mask
Each row corresponds to one mask
Each mask must have:
Shape: (1024, 1024)
Data type: uint8
Value range: 0–255
Order must exactly follow the sorted filename order
⚠️ Submissions not meeting these specifications receive a score of 0.

5. Score
Your submission is evaluated using AUPRO (Area Under the Per-Region Overlap curve), a standard metric for pixel-level anomaly segmentation.

Metric Definition
For threshold τ and defect region k:





where K is the total number of connected defect regions across all test images.

Scoring Details
Each connected defect region is evaluated independently
Integration limit: FPR ≤ 0.3
Score range: [0, 1]
Higher is better
6. Baseline and Training Set
The baseline solution is provided below
The training dataset is in the train folder
The baseline score for this task is 0.7492 in Leaderboard B
```