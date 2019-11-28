import React from 'react';
import { Link } from 'react-router-dom';
import { getObjectByID, findObjects, findPagedObjects } from '../../models/client';
import NewObjectForm from '../components/NewObjectForm';
import QueryObjectTableView from '../components/QueryObjectTableView';
import moment from 'moment';

import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'

export default class ViewPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      view: null,

      type: null,

      data: null,

      // Table View
      pageLimit: 10,
      totalPage: 1,
      page: 0,

      // Calendar View
      currentDate: new Date(),
    };
  }

  componentDidMount() {
    getObjectByID(this.props.match.params.view_id).then(v => {
      this.setState({view: v}, () => {
        if (v.viewType == 'calendar') {
          this.refetchCalendarView();
        }
      });
      getObjectByID(v.objectType).then(ot => this.setState({type: ot}));
    });
  }

  refetchCalendarView() {
    var index = this.state.view.index;
    findObjects({type: this.state.view.objectType,
      [index]: {
      $gt: moment(this.state.currentDate).subtract(1, 'month').startOf('month').toDate().getTime(),
      $lt: moment(this.state.currentDate).add(1, 'month').endOf('month').toDate().getTime(),
    }}).then(data => {
      this.setState({
        data: data,
      })
    });
  }

  render() {
    return (
      <div>
        <div className="ui menu">
          <Link className="item" to="/">
            Home
          </Link>
        </div>
        {this.renderView(this.state.view)}
      </div>
    );
  }

  calendarRef = React.createRef()

  renderView(v) {
    if (!v) {
      return <p>Loading...</p>
    }

    if (v.viewType == 'create') {
      return (
        <div>
          <div class="ui grid">
            <div class="four wide column">
              <h2>
                <i class="file alternate icon" />
                New Type
              </h2>
            </div>
          </div>
          <NewObjectForm typeID={v.objectType} />
        </div>
      );
    }

    if (v.viewType == 'table') {
      return (
        <div>
          <div class="ui grid">
            <div class="sixteen wide column">
              <h2>
                <i class="table alternate icon" />
                {v.name}
              </h2>
            </div>
          </div>

          <QueryObjectTableView
            type={this.state.view.objectType}
            query={this.state.view.filter}
            pageLimit={10}
          />
        </div>
      );
    }

    if (v.viewType == 'calendar') {
      var api = this.calendarRef.current && this.calendarRef.current.getApi();
      return (
        <div>
          <div>
            {moment(this.state.currentDate).format('MMMM YYYY')}
            <div className="right aligned">
              <button
                class="ui button primary"
                onClick={() => {
                  api && api.prev();
                  this.setState({currentDate: api.getDate()}, this.refetchCalendarView.bind(this));
                }}>
                &lt;
              </button>
              <button
                class="ui button primary"
                onClick={() => {
                  api && api.next();
                  this.setState({currentDate: api.getDate()}, this.refetchCalendarView.bind(this));
                }}>
                &gt;
              </button>
            </div>
          </div>
          <div>
            <FullCalendar
              header={'', '', ''}
              ref={this.calendarRef}
              defaultView="dayGridMonth"
              defaultDate={new Date()}
              plugins={[ dayGridPlugin ]}
              events={(this.state.data || []).map(o => ({
                title: o.name,
                date: moment(o[this.state.view.index]).format('YYYY-MM-DDTHH:mm:ss'),
              }))}
            />
          </div>
        </div>
      );
    }

    return <p>View Type not supported yet: {v.viewType}</p>
  }
}
