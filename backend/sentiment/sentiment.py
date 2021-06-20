# -*- coding: utf-8 -*-
import sys
import nltk

import pandas as pd
import numpy as np

import torch

from transformers import BertTokenizer
from transformers import BertForSequenceClassification

class SentimentBased:
    def __init__(self, model_dir_path, emoji_mapping_path):
        device = torch.device("cpu")

        tokenizer = BertTokenizer.from_pretrained('bert-base-uncased', do_lower_case=True)
        self.tokenizer = tokenizer.from_pretrained(model_dir_path)

        self.model = BertForSequenceClassification.from_pretrained(model_dir_path)
        self.model.to(device)

        self.inv_emoji = pd.read_table(emoji_mapping_path, sep=' ', header=None)


    def predict(self, sentence, K=5):
        encoded_dict = self.tokenizer.encode_plus(
                    sentence,# Sentence to encode.
                    add_special_tokens = True, # Add '[CLS]' and '[SEP]'
                    max_length = 128,           # Pad & truncate all sentences.
                    pad_to_max_length = True,
                    return_attention_mask = True,   # Construct attn. masks.
                    return_tensors = 'pt',     # Return pytorch tensors.
        )

        input_ids = encoded_dict['input_ids']
        attention_masks = encoded_dict['attention_mask']

        input_ids = input_ids.reshape(1, -1)
        attention_masks = attention_masks.reshape(1, -1)

        self.model.eval()
        with torch.no_grad():
            result = self.model(input_ids,
                token_type_ids=None, 
                attention_mask=attention_masks,
                return_dict=True)

        logits = result.logits.detach().cpu().numpy()
        result = logits[0].argsort()[::-1][:K]+1

        emoji = []
        for num in result:
            emoji.extend(self.inv_emoji[self.inv_emoji[1]==num][0].values)
        return emoji


if __name__ == '__main__':
    sentiment_based = SentimentBased("./checkpoint/model_save_1", "./checkpoint/emoji_mapping.txt")
    print(sentiment_based.predict("happy new year"))
