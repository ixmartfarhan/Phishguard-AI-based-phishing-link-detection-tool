import re, tldextract
SUSPICIOUS_TOKENS = ['login','signin','secure','verify','account','bank']

def extract_features(url):
    feats = {}
    feats['length'] = len(url)
    feats['num_digits'] = sum(c.isdigit() for c in url)
    feats['num_special'] = sum(url.count(c) for c in '-@?=.%')
    feats['num_tokens'] = sum(url.lower().count(tok) for tok in SUSPICIOUS_TOKENS)
    domain = tldextract.extract(url).domain
    feats['has_ip'] = int(re.match(r"\d+\.\d+\.\d+\.\d+", domain) is not None)
    feats['https'] = int(url.startswith("https://"))
    return feats
