import React, { useContext, useEffect, useState } from 'react';
import { Avatar, useChatContext } from 'stream-chat-react';
import { VideoCallContext } from '../../contexts/VideoCallContext';

const VideoCall = ({ setIsVideo }) => {
  const [users, setUsers] = useState([]);
  const { client } = useChatContext();
  const {
    socket,
    callEnded,
    setCallEnded,
    setCaller,
    setCallerSignal,
    setName,
    receivingCall,
    setReceivingCall,
    calledUserId,
    setCalledUserId,
    calledUserName,
    setCalledUserName,
    callAccepted,
    setCallAccepted,
    stream,
    setStream,
    connectionRef,
    myVideo,
    userVideo,
    callUser,
    setMyName,
    setMySocketId,
  } = useContext(VideoCallContext);
  useEffect(() => {
    const getUsers = async () => {
      try {
        const response = await client.queryUsers({ id: { $ne: client.userID } }, { id: 1 });
        if (response.users.length) {
          const users = response.users.filter((user) => user.online).filter((user) => user.socketId);
          setUsers(users);
        }
      } catch (err) {
        console.warn(err);
      }
    };

    if (client) {
      getUsers();
      setMyName(client.user.fullName);
      setMySocketId(client.user.socketId);
    }
  }, [client]);

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
      setStream(stream);
      myVideo.current.srcObject = stream;
    });
    return () => {
      setCallEnded(false);
      setCaller('');
      setCallerSignal(undefined);
      setName('');
      setReceivingCall(false);
      setCalledUserId(undefined);
      setCalledUserName('');
    };
  }, []);

  socket.on('callDisconnected', (data) => {
    if (data.disconnectedId === calledUserId) {
      endCall();
    }
  });

  socket.on('callEnded', (data) => {
    if (connectionRef.current) {
      connectionRef.current.destroy();
    }
    endCall();
  });

  socket.on('declineCall', (data) => {
    setCalledUserId(undefined);
    setCalledUserName('');
    connectionRef.current.destroy();
  });

  const endCall = async () => {
    try {
      myVideo.current.srcObject.getTracks().forEach((track) => track.stop());
      setCalledUserId(undefined);
      setCallEnded(true);
      setReceivingCall(false);
      setCallAccepted(false);
      setIsVideo(false);
    } catch (err) {
      console.warn(err);
    }
  };

  const leaveCall = () => {
    socket.emit('endCall', { to: calledUserId });
    if (connectionRef.current) {
      connectionRef.current.destroy();
    }
    endCall();
  };

  const goBack = () => {
    try {
      myVideo.current.srcObject.getTracks().forEach((track) => track.stop());
    } catch (err) {
      console.warn(err);
    } finally {
      setIsVideo(false);
    }
  };

  return (
    <>
      <div style={{ display: 'flex', width: '100%', flexDirection: 'column' }}>
        <div style={{ display: 'flex', width: '100%', height: '80vh' }}>
          <div style={{ display: 'flex', justifyContent: 'center', width: '50%', padding: '2rem' }}>
            {stream && <video playsInline muted ref={myVideo} autoPlay style={{ width: '30rem' }} />}
          </div>
          <div
            style={{ display: 'flex', justifyContent: 'center', width: '50%', padding: '2rem', alignItems: 'center' }}
          >
            {calledUserId && !callAccepted && !receivingCall && <p>Sunați pe {calledUserName}</p>}
            {callAccepted && !callEnded && <video playsInline ref={userVideo} autoPlay style={{ width: '30rem' }} />}
          </div>
        </div>
        <div style={{ padding: '1rem' }}>
          {!callAccepted && !calledUserId && (
            <>
              <h3>Pe cine ați vrea să sunați?</h3>
              <div style={{ display: 'flex' }}>
                {users.map((user) => (
                  <div
                    key={user.id}
                    className='user-item__wrapper'
                    style={{ padding: '0 0.5rem' }}
                    onClick={() => callUser(user.socketId, user.fullName)}
                  >
                    <div className='user-item__name-wrapper'>
                      <Avatar image={user.image} name={user.fullName || user.id} size={32} />
                      <p className='user-item__name'>{user.fullName || user.id}</p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
          {callAccepted && !callEnded && <button onClick={() => leaveCall()}>Închideți apel</button>}
          {(!callAccepted || !calledUserId) && <button onClick={() => goBack()}>Înapoi</button>}
        </div>
      </div>
    </>
  );
};

export default VideoCall;
