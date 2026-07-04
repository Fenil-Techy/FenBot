def follow_up_input(fullInput,function_call,result):
    return fullInput + [
        {
            "type":"function_call",
            "call_id":function_call["call_id"],
            "name":function_call["name"],
            "arguments":function_call["arguments"]
        },
        {
            "type":"function_call_output",
            "call_id":function_call["call_id"],
            "output":result
        }
    ]