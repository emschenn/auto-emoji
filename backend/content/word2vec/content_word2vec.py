import pickle as pk
import numpy as np
from gensim.models import Word2Vec, KeyedVectors


class ContentBased:
    channels = 300

    def __init__(self, word2vec_path, e2v_path, mapping_path):
        print(f"Loading word2vec model from {word2vec_path}")
        self.w2v_model = KeyedVectors.load_word2vec_format(word2vec_path,
                                                           binary=True)

        print(f"Loading emoji2vec model from {e2v_path}")
        self.e2v_model = KeyedVectors.load_word2vec_format(e2v_path,
                                                           binary=True)

        self.mapping = pk.load((open(mapping_path, "rb")))

    def predict(self, target_phrase, K=10):
        """ Given the target phrase, predict the topK emoji.

        Args:
            target_phrase (str)
            K (int): The number of recommendation emojis

        Returns:
            recommend_emojis (list): The list of emojis for recommendation
        """
        phrase_vec = self._get_phrase_embedding(target_phrase)

        scores = []
        for idx, emoji in self.mapping.items():
            emoji_vec = np.array(self.e2v_model[emoji])
            score = np.sum(np.abs(phrase_vec - emoji_vec))
            scores.append(score)

        scores = np.array(scores)
        topK_idx = np.argsort(scores)[:K]

        recommend_emojis = [self.mapping[idx] for idx in topK_idx]
        return recommend_emojis

    def _get_phrase_embedding(self, phrase):
        """ Get the embedding of phrase by summing up the embeddings of words.
        """
        words = phrase.split(' ')
        phr_sum = np.zeros(self.channels, np.float32)

        for word in words:
            if word in self.w2v_model:
                phr_sum += self.w2v_model[word]
            elif word in self.e2v_model:
                phr_sum += self.e2v_model[word]

        return phr_sum


if __name__ == "__main__":
    word2vec_path = './GoogleNews-vectors-negative300.bin'
    mapping_path = 'emoji_mapping.p'
    e2v_path = './emoji2vec.bin'
    insert_values = 'wash your hands'
    content_based = ContentBased(word2vec_path, e2v_path, mapping_path)
    content_option = content_based.predict(insert_values, K=10)
    print(content_option)
