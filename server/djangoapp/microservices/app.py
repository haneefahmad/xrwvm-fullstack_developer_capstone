from flask import Flask, request
from nltk.sentiment import SentimentIntensityAnalyzer

app = Flask('Sentiment Analyzer')

sia = SentimentIntensityAnalyzer()


@app.get('/')
def home():
    return 'Welcome to the Sentiment Analyzer. Use /analyze?input_txt=text to get the sentiment'


@app.get('/analyze')
@app.get('/analyze/<input_txt>')
def analyze_sentiment(input_txt=None):
    text = input_txt or request.args.get('input_txt', '')
    scores = sia.polarity_scores(text)
    pos = float(scores['pos'])
    neg = float(scores['neg'])
    neu = float(scores['neu'])
    res = 'positive'

    if neg > pos and neg > neu:
        res = 'negative'
    elif neu > neg and neu > pos:
        res = 'neutral'

    return {'sentiment': res}


if __name__ == '__main__':
    app.run(debug=True)
