# Conversational AI SDK Python example

## How to run the code

1. Clone this repo
1. `cd elevenlabs-examples/examples/conversational-ai-python`
1. Install the dependencies

   ```bash
   poetry install
   # Or if you don't want to use poetry
   pip install -e .
   ```

1. Set up environment variables. You must set the agent ID. The API key is required if the agent is not public ("Enable authentication" in the agent settings).

    ```bash
    export AGENT_ID=agentid
    export ELEVENLABS_API_KEY=sk_yourkey
    ```

1. Run the demo:

   ```bash
   poetry run demo
   # Or if you don't want to use poetry
   python3 -m convai.demo
   ```

1. You can talk to your agent. The demo will use the system default audio input/output devices - make sure your microphone and speakers or headphones are not muted. You can end the conversation by pressing Ctrl+C.