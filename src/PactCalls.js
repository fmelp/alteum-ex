import React from "react";
import Pact from "pact-lang-api";

const API_HOST = "http://localhost:9001";

class PactCalls extends React.Component {

  state = {
    publicKey: "",
    secretKey: "",
    id: "",
    members: []
  }

  joinMeetup = () => {
    //little workaround to deal with different key formatting
    //explained in making .yaml file
    let publicKey = this.state.publicKey
    let secretKey = this.state.secretKey.replace(publicKey, "");
    const cmd = {
      pactCode: `(meetup.join-meetup ${JSON.stringify(this.state.id)})`,
      keyPairs: {
        publicKey: publicKey,
        secretKey: secretKey
      },
      meta: Pact.lang.mkMeta(this.state.id, "", 0, 0),
      envData: { [this.state.id]: [publicKey] }
    }
    //actual send command
    //remember api host and what it is
    Pact.fetch.send(cmd, API_HOST);
  }

  showParticipants = () => {
    let publicKey = this.state.publicKey
    let secretKey = this.state.secretKey.replace(publicKey, "");
    const cmd = {
      pactCode: `(meetup.get-members)`,
      keyPairs: {
        publicKey: publicKey,
        secretKey: secretKey
      },
      meta: Pact.lang.mkMeta(this.state.id, "", 0, 0),
      envData: { [this.state.id]: [publicKey] }
      }

      Pact.fetch.local(cmd, API_HOST)
        .then(res => {
          let members = res.data;
          if (members === undefined) {
            members = ["you are not registered"]
          }
          this.setState({ members: members });
        })
  }

  render() {
    return (
      <div>
        <div>
          <input
            onChange={(e) => this.setState({ publicKey: e.target.value })}
            value={this.state.publicKey}
            placeHolder="public key"
          />
          <input
            onChange={(e) => this.setState({ secretKey: e.target.value })}
            value={this.state.secretKey}
            placeHolder="private key"
          />
          <input
            onChange={(e) => this.setState({ id: e.target.value })}
            value={this.state.id}
            placeHolder="id"
          />
          <button
            onClick={() => this.joinMeetup()}
          >
            join meetup
          </button>
        </div>
        <div>
          <button
            onClick={() => this.showParticipants()}
          >
            show participants
          </button>
          {this.state.members.map((member) => {
            return (
              <div>
                <text>
                  {member}
                </text>
              </div>
            )
          })}
        </div>
      </div>
    );
  }

}

export default PactCalls;
