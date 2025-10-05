export const bestSolutions = [
    {
        contest: "October 2025",
        problem: "Find the Brain Tumor",
        student: "Nikoloz Gegenava",
        score: 0.79,
        downloadUrl: "#",
        writeup: `Problem states: You are given a training set with roughly ~2% of the data labeled.

Since manual labelling and pretrained models (except resnet18) are prohibited, only way to achieve good score is self-supervised learning (SSL)

SSL is a method, when we use the unlabeled data for models training. Usage of unlabaled data varies over SSL methods. To understand this method better, lets overview some examples of SSL. Popular and most useful SSL:

1. Self training with noisy student: https://arxiv.org/pdf/1911.04252
You first train the teacher model on labeled data, and generate pseudo labels for the unlabeled data. Then you create new student model (Which is equal or larger than teacher), which is trained on pseudo labels and labeled data too. For better generalization, we inject noise in student model and data itself (for model we use dropout (Dropping some neurons randomly) and stochastic depth (stochastic depth: Removing some layers randomly to shorten the network and reduce variance), and for data we use strong augmentations), which improves the performance of student model and reduces variance.

2. FixMatch: https://arxiv.org/pdf/2001.07685
We train the model on labeled data. For inference, we use weak augmentation to predict class probability and we use confidence threshold (Ex: predicting class probability). If the probability is higher than conf threshold, we chose it as pseudo label for class. After this, we use stronger augmentations on all the images and train the model another time. Training objective is to match pseudo labels with the strong-augmented training models prediction.

For the solution, we used fixmatch and achieved 0.79 on private leaderboard (Noisy student might take too much time).

We didnt break any rules of problem:

* Runtime: 10min on T4/P100 16gb VRAM
* Didnt label manually
* Didnt use any other models or weights except resnet18

P.S if you want more details, check out the notebook, there are comments within the code.
      `,
        fileName: "find-the-brain-tumor.zip",
    },
    {
        contest: "October 2025",
        problem: "Deceptive Points",
        student: "Nikoloz Gegenava",
        score: 0.011,
        downloadUrl: "#",
        writeup: `In the problem, we have to handle corrupted/noisy data. Lets do little bit of data to understand the corruption better.

First main point for best solution: The distributions of all features look like gaussian distribution. (download (2) in files)

Second main point: You can notice here that the PCA of all features VS Y plot looks X shaped. (download (1) in files) There is very simple explanation: The students corruption is the diagonal from top left to bottom right, while real data is the trend line from bottom left to top right. Or the corrupted one is from bottom left to top right. Our model must identify corrupted and real data, to perform well on test. There are many ways with handling this type of corrupted data, but best ones mainly involve inlier/outliner methods (Such as RANSAC (https://scikit-learn.org/stable/modules/generated/sklearn.linear_model.RANSACRegressor.html)) or soft clustering methods with weighted confidence (GMM (https://scikit-learn.org/stable/modules/generated/sklearn.mixture.GaussianMixture.html)).

RANSAC works very simply: It randomly samples data to get random subsets, fits estimator (which mostly is linear regression or any other model) to this random subset. After the model is fitted, checks the points which are agreeing with the fitted trendline within some threshold. This points are called inliers, while other points are outliers. This process is iterated overtime, and after n iteration, it chooses the mode which has largest number of inliers. This is how we did Solution A. This solution was made because of Main point 2.

GMM: We assume that the data is generated from a mixture of several gaussian distributions. The algorithm tries to identify gaussian components. This is used because of Main point 1.

Better score was gotten by GMM, so lets explain its solution more clearly:
First off we scale the features to reduce dominance within any feature (as we saw ranges, the difference between feature min/max isnt spotted, but lets avoid any problem)

Then we use GMM (Gaussian mixture model), which groups points to n clusters and assigns probability for each class. This is much more effective than RANSAC, because the access to probability will help the estimator model to choose it based on confidence of the point belonging to cluster.

Since we identified two clusters with probabilities, we want to know which one is teacher and which one is corrupt student. Thats why we can use correlation to see which clusters points are linearly dependant on Y.

Formula: correlation = covariance(X, Y)/std(X)*std(Y) (More: https://en.wikipedia.org/wiki/Correlation)

Higher the correlation, more linear dependance.

Since teacher models points are identified, we can use any base estimator with its weights being GMMs probability.

Score = 0.011
      `,
        fileName: "deceptive-points.zip",
    },
];