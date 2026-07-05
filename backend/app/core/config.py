from pydantic_settings import BaseSettings,SettingsConfigDict

class Settings(BaseSettings):
    OPENAI_API_KEY:str
    DATABASE_URL:str

    SHOPIFY_STORE_DOMAIN: str
    SHOPIFY_ACCESS_TOKEN: str

    WHATSAPP_PHONE_NUMBER_ID: str
    WHATSAPP_ACCESS_TOKEN: str
    WHATSAPP_VERIFY_TOKEN: str
    
    model_config=SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )
settings=Settings()