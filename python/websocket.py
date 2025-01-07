import asyncio
import websockets
import cv2

async def send_data_once(uri, data):
    # WebSocket 연결을 with 문으로 관리
    async with websockets.connect(uri) as websocket:
        # 데이터 전송
        await websocket.send(data)
        print(f"Sent: {data}")
        # 연결은 with 문이 끝나면 자동으로 닫힘

# 실행
uri = "ws://172.30.1.55:8000/room3"  # WebSocket 서버 URI

image = cv2.imread('./data/20241220_171420130_0129_1.jpg')
send_data = cv2.resize(image.copy(), (200, 180))
_, img_encoded = cv2.imencode('.jpg', send_data)

send_data = img_encoded.tobytes()

asyncio.run(send_data_once(uri, send_data))