from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from google.oauth2 import id_token
from google.auth.transport import requests

app = FastAPI()

# Enable CORS so React (localhost:3000) can talk to Python (localhost:5000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Update this to specific origins in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Replace with your actual Client ID
GOOGLE_CLIENT_ID = "803792661988-1mfd36s2pbpi5i54bb2hl9r167061cei.apps.googleusercontent.com"

# Define the expected JSON payload using Pydantic
class TokenRequest(BaseModel):
    token: str

@app.post('/api/google-login')
async def google_login(data: TokenRequest):
    # FastAPI automatically extracts and validates 'token' from the request body
    token = data.token

    if not token:
        raise HTTPException(status_code=400, detail="No token provided")

    try:
        # Verify the token with Google's servers
        idinfo = id_token.verify_oauth2_token(
            token, 
            requests.Request(), 
            GOOGLE_CLIENT_ID
        )

        # Token is valid! Extract user info
        user_email = idinfo.get('email')
        user_name = idinfo.get('name')
        google_subject_id = idinfo.get('sub') # Unique Google ID for the user

        # --- YOUR APP LOGIC HERE ---
        # 1. Check if user exists in your database using user_email or google_subject_id.
        # 2. If not, create a new user account.
        # 3. Generate your own session token or JWT to send back to the frontend
        # FastAPI automatically serializes dictionaries to JSON
        return {
            "message": "Login successful",
            "user": {
                "email": user_email,
                "name": user_name
            }
        }

    except ValueError as e:
        # Invalid token
        print("Token verification failed:", e)
        raise HTTPException(status_code=401, detail="Invalid token")

if __name__ == '__main__':
    import uvicorn
    # Run the server on port 5000 to match your previous setup
    uvicorn.run(app, host="127.0.0.1", port=5000)