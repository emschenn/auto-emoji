from transformers import AutoTokenizer, AutoModel
import numpy as np
import torch
import json


class ContentBased:
    channels = 300

    def __init__(self):
        with open('description_embeddings.json') as f:
            self.emoji_embeddings = json.load(f)
        self.tokenizer = AutoTokenizer.from_pretrained(
            "sentence-transformers/bert-base-nli-mean-tokens")
        self.model = AutoModel.from_pretrained(
            "sentence-transformers/bert-base-nli-mean-tokens")

    def mean_pooling(self, model_output, attention_mask):
        # First element of model_output contains all token embeddings
        token_embeddings = model_output[0]
        input_mask_expanded = attention_mask.unsqueeze(
            -1).expand(token_embeddings.size()).float()
        sum_embeddings = torch.sum(token_embeddings * input_mask_expanded, 1)
        sum_mask = torch.clamp(input_mask_expanded.sum(1), min=1e-9)
        return sum_embeddings / sum_mask

    def predict(self, target_phrase, K=10):
        """ Given the target phrase, predict the topK emoji.

        Args:
            target_phrase (str)
            K (int): The number of recommendation emojis

        Returns:
            recommend_emojis (list): The list of emojis for recommendation
        """
        phrase_embeddings = self._get_phrase_embedding(target_phrase)

        scores = []

        for idx, emoji in self.emoji_embeddings.items():
            score = np.sum(
                np.abs(phrase_embeddings.numpy().reshape(-1) - emoji))
            scores.append(score)

        scores = np.array(scores)
        topK_idx = np.argsort(scores)[:K]
        recommend_emojis = []
        emoji_keys = list(self.emoji_embeddings.keys())

        for x in topK_idx:
            recommend_emojis.append(emoji_keys[x])

        return recommend_emojis

    def _get_phrase_embedding(self, phrase):
        """ Get the embedding of phrase
        """
        encoded_input = self.tokenizer(phrase, padding=True,
                                       truncation=True, max_length=128, return_tensors='pt')
        with torch.no_grad():
            model_output = self.model(**encoded_input)
        phrase_embeddings = self.mean_pooling(
            model_output, encoded_input['attention_mask'])

        return phrase_embeddings


if __name__ == "__main__":
    insert_values = 'put on your mask and wash your hand frequently'
    content_based = ContentBased()
    content_option = content_based.predict(insert_values, K=10)
    print(content_option)
