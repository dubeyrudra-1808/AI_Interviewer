from dotenv import load_dotenv

from livekit import agents
from livekit.agents import AgentSession, Agent, RoomInputOptions
from livekit.plugins import (
    google,
    cartesia,
    deepgram,
    noise_cancellation,
)

load_dotenv(".env")


class Assistant(agents.Agent):
    def __init__(self) -> None:
        super().__init__(instructions="  Dont use  asterstik (*) in response,, Your name is Mary , you are an SDE role interviewer, You are software Engineering  expert  and you have to take interview of candidate to test his/her DSA and web development skills  skills ,keep your response short and crisp,  first ask him/her to introduce himself and then proceed the interview ")


async def entrypoint(ctx: agents.JobContext):
  
    session = AgentSession(
        stt=deepgram.STT(model="nova-3", language="en"),
        llm=google.LLM(model="gemini-2.0-flash-lite"),
        tts=cartesia.TTS(  model="sonic-2"),
    )

    await session.start(
        room=ctx.room,
        agent=Assistant(),
        room_input_options=RoomInputOptions(
            noise_cancellation=noise_cancellation.BVC(),
        ),
    )


    await session.generate_reply(
        instructions="Dont use  asterstik (*) in response, You are software Engineering  expert and you have to take interview of candidate to test his/her DSA skills , first ask him.her to introduce himself and then proceed the interview , keep your response short and crisp "
    )


if __name__ == "__main__":
    agents.cli.run_app(agents.WorkerOptions(entrypoint_fnc=entrypoint))
