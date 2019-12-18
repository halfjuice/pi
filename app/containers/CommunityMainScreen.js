import React from 'react';
import { Link } from 'react-router-dom';
import { communityDB, findObjects, PrimType } from '../../models/client';

const SECTION_SPECS = [
  {
    name: 'Official',
    query: {type: PrimType.CommunityModel, author: 'notely'},
    skip: 0,
  },
  {
    name: 'Latest',
    query: {type: PrimType.CommunityModel, createdAt: {$gt: null}},
    skip: 0,
    sort: [{'createdAt': 'desc'}],
  },
  // TODO: Random Section
]

export default class CommunityMainScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sections: SECTION_SPECS.map(spec => ({
        name: spec.name,
        result: [],
      })),
    };
  }

  componentDidMount() {
    this.state.sections.forEach((sec, i) => {
      let spec = SECTION_SPECS[i];
      communityDB.findObjects(spec.query, spec.skip, 5, spec.sort).then(docs => {
        this.state.sections[i].result = docs;
        this.setState({sections: this.state.sections});
      });
    });
  }

  render() {
    console.log(this.state.sections);
    return (
      <div>
        <div className="ui menu">
          <Link className="item" to="/">
            Home
          </Link>
        </div>
        {this.state.sections.map(sec => {
          if (!sec.result) {
            return null;
          }

          return (
            <div key={`section_${sec.name}`} style={{paddingTop: '16px'}}>
              <h4>{sec.name}</h4>
              <div className="ui grid">
                <div className="five column row">
                  {sec.result.map(res => (
                    <div key={`model_${res._id}`} className="column" style={{paddingTop: '16px'}}>
                      <div className="ui card">
                        <div className="content">
                          <div className="header">
                            {res.author} / {res.name}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  }
}
