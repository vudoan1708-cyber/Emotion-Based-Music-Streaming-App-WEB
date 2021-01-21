def findNewConnection(clients, id):
  for i in range(len(clients)):
    if clients[i] == id:
      return clients[i]
    else:
      if i == len(clients) - 1:
        return None
