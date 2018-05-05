<script type="text/javascript" async
  src="https://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-MML-AM_CHTML">
</script>

# Statistics
We can divide the statistics in 3 parts:
- Data analysis (Gathering, display and summary of the data).
- Probability (chance).
- Statistical inference (make conclusions base in Data analysis and Probability).

## Summary of the data.

### Mean

Being all the data N, and the sample data n.

True mean
$$\mu = \sum_{i=1}^n\frac{x_i}{n}$$

Sample mean
$$\bar{x} = \sum_{i=1}^N\frac{x_i}{n}$$

### Median
Order all the elements by value, if is odd then get the one in the middle, if is even take the both in the middle and $$\frac{x_i + x_{i+1}}{2}$$

## Meassures of spread

How separate is the data between them.

### Interquartile range

The Interquartile meassure how spread is the data from the median.

Order all the elements by value and divide it in 2 groups.
Then calculate the median of the first group, this will be the first quartile Q1.
Calculate the median of the second group, third quartile Q3.

$$IQR = Q3 - Q1$$


### Variance and Standard deviation

The variance meassure how spread is the data from the mean.
Roughly is the average distance from the mean.

The variance is represented as $$\sigma^2$$ As well we have the Sample variance $$S^2$$ 

Defined as:

$$\sigma^2 = \frac{1}{N} \sum_{i=1}^N (x_i -\mu)$$

$$S^2 = \frac{1}{n - 1} \sum_{i=1}^n (x_i -\bar{x})$$

The difference between both of them is that in the case of Sample variance, we have take a sample of the data, so we are "bias", in order to make it less bias, we will divide by a smaller number to have a bigger value. (unbiased).

(here you can find an explanation)[https://www.khanacademy.org/math/ap-statistics/summarizing-quantitative-data-ap/more-standard-deviation/v/review-and-intuition-why-we-divide-by-n-1-for-the-unbiased-sample-variance]

We define the standar deviation as the square root of the variance.

Remember that in the case of the variance we have squared the distance to the mean, to make it positive, so the data is not anymore in terms of the original data.

So we will have the standard deviation as:

$$\sigma = \sqrt{ \frac{1}{N} \sum_{i=1}^N (x_i -\mu)^2}$$

$$S = \sqrt{ \frac{1}{n - 1} \sum_{i=1}^n (x_i -\bar{x})^2}$$

Is a good meassure to know how many standard deviation a data is away from the mean, is called Z-scores.

$$Z_i=\frac{X_i-\bar{X}}{S}$$

Is useful to calculate which % of the data is inside 1 Z-score, 2 Z-scores, etc.
