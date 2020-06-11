from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
from flask_socketio import SocketIO, emit

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///db.sqlite3'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)
ma = Marshmallow(app)
socketio = SocketIO(app, cors_allowed_origins="*")


class Message(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), nullable=False)
    content = db.Column(db.Text, nullable=False)


class MessageSchema(ma.Schema):
    class Meta:
        fields = ("id", "username", "content")


message_schema = MessageSchema()
messages_schema = MessageSchema(many=True)


@socketio.on('connect')
def on_connected():
    messages = Message.query.order_by(Message.id.desc())
    print(messages_schema.dump(messages))
    emit('chat messages', {'data': messages_schema.dump(messages)}, json=True)


@socketio.on('chat message')
def on_received_chat(msg):
    print(msg)

    new_message = Message(username=msg['username'], content=msg['content'])

    db.session.add(new_message)
    db.session.commit()

    emit('chat message', {'data': msg}, broadcast=True)


if __name__ == '__main__':
    db.create_all()
    socketio.run(app)
