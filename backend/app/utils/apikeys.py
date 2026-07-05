
import hashlib
import hashlib
import secrets

def generate_api_key()->tuple[str,str,str]:
    raw_key=f"fb_{secrets.token_urlsafe(32)}"
    hash_key=hashlib.sha256(raw_key.encode()).hexdigest()
    prefix=raw_key[:10]

    return raw_key,hash_key,prefix

def hash_key_check(raw_key:str)->str:
    return hashlib.sha256(raw_key.encode()).hexdigest()
    
    
    