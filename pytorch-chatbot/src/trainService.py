import numpy as np

import torch
import torch.nn as nn
from torch.utils.data import Dataset, DataLoader

from nltk_utils import bag_of_words, tokenize, stem
from model import NeuralNet
from store import retrieve

def train():
    nodes = retrieve('nodes')

    all_words = []
    ids = []
    xy = []
    # loop through each sentence in our node patterns
    for node in nodes:
        # add to id list
        ids.append(node['id'])
        for pattern in node['patterns']:
            # tokenize each word in the sentence
            w = tokenize(pattern)
            # add to our words list
            all_words.extend(w)
            # add to xy pair
            xy.append((w, node['id']))

    # stem and lower each word and remove stop words
    ignore_words = ['?', '.', '!', '(', ')']
    stop_words = retrieve('stop_words')
    all_words = [w for w in all_words if not w.lower() in stop_words]
    all_words = [stem(w) for w in all_words if w not in ignore_words]

    # remove duplicates and sort
    all_words = sorted(set(all_words))
    ids = sorted(set(ids))

    # create training data
    x_train = []
    y_train = []
    for (pattern_sentence, id) in xy:
        # X: bag of words for each pattern_sentence
        bag = bag_of_words(pattern_sentence, all_words)
        x_train.append(bag)

        # y: PyTorch CrossEntropyLoss needs only class labels, not one-hot
        y_train.append(ids.index(id))

    x_train = np.array(x_train)
    y_train = np.array(y_train)

    # Hyper-parameters 
    num_epochs = 1000
    batch_size = 8
    learning_rate = 0.001
    input_size = len(x_train[0])
    hidden_size = 8
    output_size = len(ids)

    class ChatDataset(Dataset):
        def __init__(self):
            self.n_samples = len(x_train)
            self.x_data = x_train
            self.y_data = y_train

        # support indexing such that dataset[i] can be used to get i-th sample
        def __getitem__(self, index):
            return self.x_data[index], self.y_data[index]

        # we can call len(dataset) to return the size
        def __len__(self):
            return self.n_samples

    dataset = ChatDataset()
    train_loader = DataLoader(dataset=dataset,
                              batch_size=batch_size,
                              shuffle=True,
                              num_workers=0)

    device = torch.device('cpu')

    model = NeuralNet(input_size, hidden_size, output_size).to(device)

    # Loss and optimizer
    criterion = nn.CrossEntropyLoss()
    optimizer = torch.optim.Adam(model.parameters(), lr=learning_rate)

    # Train the model
    for epoch in range(num_epochs):
        for (words, labels) in train_loader:
            words = words.to(device)
            labels = labels.to(dtype=torch.long).to(device)

            # Forward pass
            outputs = model(words)
            # if y would be one-hot, we must apply
            # labels = torch.max(labels, 1)[1]
            loss = criterion(outputs, labels)

            # Backward and optimize
            optimizer.zero_grad()
            loss.backward()
            optimizer.step()

    data = {
        "model_state": model.state_dict(),
        "input_size": input_size,
        "hidden_size": hidden_size,
        "output_size": output_size,
        "all_words": all_words,
        "ids": ids
    }

    torch.save(data, "data.pth")