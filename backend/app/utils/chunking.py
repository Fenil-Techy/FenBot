from langchain_text_splitters import RecursiveCharacterTextSplitter

_splitter = RecursiveCharacterTextSplitter(
        chunk_size=1200,
        chunk_overlap=200,
        separators=[
            "\n\n",   # paragraphs
            "\n",     # lines
            ". ",     # sentences
            " ",      # words
            ""        # characters (fallback)
        ],
        length_function=len,
        is_separator_regex=False,
    )
def chunk_text(text: str) -> list[str]:
    return _splitter.split_text(text)