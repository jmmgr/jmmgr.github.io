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

$$\sigma^2 = \frac{1}{N} \sum_{i=1}^N (x_i -\mu)^2$$

$$S^2 = \frac{1}{n - 1} \sum_{i=1}^n (x_i -\bar{x})^2$$

The difference between both of them is that in the case of Sample variance, we have take a sample of the data, so we are "bias", in order to make it less bias, we will divide by a smaller number to have a bigger value. (unbiased).

[here you can find an explanation](https://www.khanacademy.org/math/ap-statistics/summarizing-quantitative-data-ap/more-standard-deviation/v/review-and-intuition-why-we-divide-by-n-1-for-the-unbiased-sample-variance)

We define the standar deviation as the square root of the variance.

Remember that in the case of the variance we have squared the distance to the mean, to make it positive, so the data is not anymore in terms of the original data.

So we will have the standard deviation as:

$$\sigma = \sqrt{ \frac{1}{N} \sum_{i=1}^N (x_i -\mu)^2}$$

$$S = \sqrt{ \frac{1}{n - 1} \sum_{i=1}^n (x_i -\bar{x})^2}$$

Is a good meassure to know how many standard deviation a data is away from the mean, is called Z-scores.

$$Z_i=\frac{X_i-\bar{X}}{S}$$

Is useful to calculate which % of the data is inside 1 Z-score, 2 Z-scores, etc.

## Probability

P(X) => Probability of event X to happen, is meassure from 0 to 1, being 0 never, and 1 always.

$$P(0_i) >= 0$$

Total probability of all elementary outcomes is 1.

$$P(O_1)+P(O_2)+...+P(O_n) = 1$$

They are usually combined of 3 ways:

- E AND F => Probability of happen E and F event to occur.
- E OR F => Event E OR F occurs (OR both).
- NOT E => Event E doesn't happen.
- P(A|C) => Conditional probability, C already ocurred, what is the probability that A will occur.


### OR

$$ P(E \; OR \; F) = P(E) + P(F) - P(E \; AND \; F) $$ 

For example if want to know the probability of a die to be even OR 2. You wil have:
$$P(Even \; OR \; 2) = P(Even) + P(2) - P(Even \; AND \; 2)$$

$P(Even \; OR \; 2) = 3/6 + 1/6 - 1/6 = 3/6$. Of course is the same as being even, since is included.

If the events are exclusive, for example P(even OR 1), the formula would be:

$ P(E \; OR \; F) = P(E) + P(F) $  Cause P(E \; AND \; F) is 0.

$$ P(even \; OR \; 1) = 3/6 + 1/6) = 4/6 $$

### NOT

$$ P(E) = 1 - P(NOT \; E) $$

Sometimes is easier to compute P(NOT E) than P(E), so is a great tool.

### Conditional probability

$$ P(E|F) = \frac{P(E \; AND \; F)}{P(F)} $$

For example we want to throw 2 dices, what are the probability of those 2 add 3.

Before throwing any dice, the probability is 2/36 (either 1,2 or 2,1).

But if someone throws a die first, and get a 1, the probability will be 1/6.

Some characteristics of conditional probability are:
$$P(E|E) = 1 $$

When E and F are mutually exclusive we  have:
$$P(E|F) = 0 $$

If we rearranage the conditional probability rule, we get the multiplication rule:
$$P(E \; AND \; F) = P(E|F)P(F)$$

## AND
When two events are INDEPENDENT we can say:

$$ P(E \; AND \; F) = P(E)P(F) $$

With independent we mean that one event, won't chanve the P() of the other. So won't condition the other event.

In other words:
$$P(E) = P(E|F)$$

In the case of throwing 2 dices and adding get a 3, we have 2 events:
- E: Event of adding 3.
- F: Event of throw a 1.

In this case they are not independent so $ P(E \; AND \; F) = P(E)P(F) $, won't fulfill.

Because once you get a 1, it will change the P() of sum 3.


### Example, De Mere's problem
De Mere's was a french gambler, he wanted to know what is the probability of getting at least one six in four throws.

There are two ways of calculating this, with the OR rule, or with the NOT rule.

If we calculate it with the OR rule we will need to calculate:

 $$P(A_1\;OR..OR\;A_4) = P(1/6)..P(1/6) - P(Two\;6) - P(Three\;6) - P(Four\;6)$$

This seems quite a tedious way of calculating it.

If we calculate it with the NOT rule would be the P of not getting a 6. Since all the events are independent we have:

$$P(A_1\;AND..AND\;A_4) = P(A_1)P(A_2)P(A_3)P(A_4)$$

$$P(E) = 1 - P(NOT\;E) = 1 - \frac{5}{6}^4$$

## Bayes Theorem

$$P(A|B) = \frac{P(A)P(B|A)}{P(B)} $$

Is derived from:

$$P(A|B) = \frac{P(A)P(B|A)}{P(A)P(B|A)+P(NOT\;A)P(B|NOT\;A)} $$

That gives

$$P(A|B) = \frac{P(A\;AND\;B)}{P(A\; AND \; B)+P(NOT\;A\;AND\;B)$$

