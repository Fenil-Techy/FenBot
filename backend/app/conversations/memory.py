conversations: dict[str, list] = {}

def get_history(wa_id: str):
    return conversations.get(wa_id, [])

def save_history(wa_id: str, history: list):
    conversations[wa_id] = history