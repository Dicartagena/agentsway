import os
import time
from dotenv import load_dotenv
from elevenlabs.client import ElevenLabs
from typing import Optional

from dubbing_utils import wait_for_dubbing_completion, download_dubbed_file

# Load environment variables
load_dotenv()

# Retrieve the API key
ELEVENLABS_API_KEY = os.getenv("ELEVENLABS_API_KEY")
if not ELEVENLABS_API_KEY:
    raise ValueError(
        "ELEVENLABS_API_KEY environment variable not found. "
        "Please set the API key in your environment variables."
    )

client = ElevenLabs(api_key=ELEVENLABS_API_KEY)


def create_dub_from_file(
    input_file_path: str,
    file_format: str,
    source_language: str,
    target_language: str,
) -> Optional[str]:
    """
    Dubs an audio or video file from one language to another and saves the output.

    Args:
        input_file_path (str): The file path of the audio or video to dub.
        file_format (str): The file format of the input file.
        source_language (str): The language of the input file.
        target_language (str): The target language to dub into.

    Returns:
        Optional[str]: The file path of the dubbed file or None if operation failed.
    """
    if not os.path.isfile(input_file_path):
        raise FileNotFoundError(f"The input file does not exist: {input_file_path}")

    with open(input_file_path, "rb") as audio_file:
        response = client.dubbing.dub_a_video_or_an_audio_file(
            file=(os.path.basename(input_file_path), audio_file, file_format),
            target_lang=target_language,
            mode="automatic",
            source_lang=source_language,
            num_speakers=1,
            watermark=True,  # reduces the characters used
        )

    dubbing_id = response.dubbing_id
    if wait_for_dubbing_completion(dubbing_id, target_language):
        output_file_path = download_dubbed_file(dubbing_id, target_language)
        return output_file_path
    else:
        return None