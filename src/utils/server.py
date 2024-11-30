from flask import Flask, request, jsonify, session
from flask_cors import CORS
import sys
import io
from contextlib import redirect_stdout
import traceback

app = Flask(__name__)
CORS(app, supports_credentials=True)
app.secret_key = "your-secret-key-here"  # Change this to a secure secret key

# Dummy user database
USERS = {
    "child": {"password": "child", "user_type": "children"},
    "inter": {"password": "inter", "user_type": "intermediate"},
    "pro": {"password": "pro", "user_type": "professional"},
}


@app.route("/api/register", methods=["POST"])
def register():
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")
    user_type = data.get("userType")

    if username in USERS:
        return jsonify({"success": False, "error": "Username already exists"}), 400

    USERS[username] = {"password": password, "user_type": user_type}

    session["username"] = username
    session["user_type"] = user_type

    return jsonify({"success": True, "username": username, "userType": user_type})


@app.route("/api/login", methods=["POST"])
def login():
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")

    user = USERS.get(username)
    if user and user["password"] == password:
        session["username"] = username
        session["user_type"] = user["user_type"]
        return jsonify(
            {"success": True, "username": username, "userType": user["user_type"]}
        )

    return jsonify({"success": False, "error": "Invalid credentials"}), 401


@app.route("/api/logout", methods=["POST"])
def logout():
    session.clear()
    return jsonify({"success": True})


@app.route("/api/user", methods=["GET"])
def get_user():
    if "username" in session:
        return jsonify(
            {
                "success": True,
                "username": session["username"],
                "userType": session["user_type"],
            }
        )
    return jsonify({"success": False}), 401


@app.route("/execute", methods=["POST"])
def execute_code():
    if "username" not in session:
        return jsonify({"success": False, "error": "Authentication required"}), 401

    try:
        code = request.json.get("code", "")

        # Create string buffer to capture output
        buffer = io.StringIO()

        # Redirect stdout to buffer
        with redirect_stdout(buffer):
            # Execute the code
            exec(code, {}, {})

        # Get output from buffer
        output = buffer.getvalue()

        return jsonify({"success": True, "output": output})

    except Exception as e:
        # Get the full error traceback
        error_traceback = traceback.format_exc()
        return jsonify(
            {"success": False, "error": str(e), "traceback": error_traceback}
        )


if __name__ == "__main__":
    app.run(port=8080, debug=True)
