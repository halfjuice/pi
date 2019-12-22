
import React from 'react';
import { findObjects, createObject } from '../../models/client';
import { obj2tuples, tuples2obj } from '../utils/helper';
import { getTypeSpecFromFieldSpec } from '../components/NewTypeFieldRow';

class ImportColumnPolicySpec extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ...props.policy
    };
  }

  render() {
    return (
      <>
        <div className="equal width fields">
          <div className="field">
            <label>{this.props.fieldKey} {this.props.fieldKey != 'name' && <>({getTypeSpecFromFieldSpec(this.props.fieldType).text})</>}</label>
            <select
              className="ui fluid dropdown"
              onChange={v => this.setState({colIdx: v.target.value}, this.update.bind(this))}
              value={this.props.policy.colIdx}>
              <option value="">[Empty]</option>
              {this.props.columns.map((c, i) =>
                <option key={`col${i}`} value={i}>{c}</option>
              )}
            </select>
          </div>

          {this.props.fieldKey == 'name' && this.props.policy.colIdx &&
            <div className="field">
              <label>When Name Duplicated</label>
              <select
                className="ui fluid dropdown"
                onChange={v => this.setState({nameDup: v.target.value}, this.update.bind(this))}
                value={this.props.policy.nameDup}>
                {[
                  ['overwrite', 'Overwrite'],
                  ['create', 'Create'],
                  ['skip', 'Skip'],
                ].map(([v, n]) => <option key={`name_resolve_${v}`} value={v}>{n}</option>)}
              </select>
            </div>
          }

          {this.props.fieldType.fieldType == 'multi_relation' &&
            <div className="field">
              <label>Delimiter</label>
              <input
                type="text"
                onChange={v => this.setState({delimiter: v.target.value}, this.update.bind(this))}
                value={this.props.policy.delimiter}
              />
            </div>
          }
        </div>
        {['relation', 'multi_relation'].includes(this.props.fieldType.fieldType) &&
          <div className="inline field">
            <div className="ui checkbox">
              <input
                type="checkbox"
                value={this.props.policy.relCreateIfMissing}
                onChange={v => this.setState({relCreateIfMissing: v.target.checked}, this.update.bind(this))}
              />
              <label>Create If Missing</label>
            </div>
            <div className="ui checkbox">
              <input
                type="checkbox"
                value={this.props.policy.relPickOneIfDup}
                onChange={v => this.setState({relPickOneIfDup: v.target.checked}, this.update.bind(this))}
              />
              <label>Pick One If Duplicated</label>
            </div>
          </div>
        }
      </>
    );
  }

  update() {
    this.props.onChange && this.props.onChange(this.state);
  }
}

export default class ImportView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      step: 1,
      processing: false,
      error: null,

      // step 1 data
      content: '',
      files: [],

      // step 2 data
      policy: {},
    };

    this.fileRef = React.createRef();
  }

  render() {
    return (
      <>
        <div className="content">
          {this.state.error &&
            <div className="ui red message">
              {this.state.error}
            </div>
          }
          {this.state.step == 1 && this.renderFirstStepContent()}
          {this.state.step == 2 && this.renderSecondStepContent()}
          {this.state.step == 3 && this.renderThirdStepContent()}
          {this.state.step == 4 && this.renderFourthStepContent()}
        </div>
        <div className="actions">
          {this.renderBottomNav()}
        </div>
      </>
    );
  }

  renderFirstStepContent() {
    return (
      <div className="ui form">
        <div className="field">
          <label>Choose an xlsx/xls/csv to import (In UTF-8)...</label>
          <input type="file" onChange={this.onFileSelected.bind(this)} />
        </div>
      </div>
    );
  }

  onFileSelected(v) {
    this.setState({files: v.target.files});
  }

  renderSecondStepContent() {
    return (
      <div className="ui form">
        <p>Specify detail information for importing:</p>
        {this.getTypeColumns().map(col => (
          <ImportColumnPolicySpec
            key={`import_col_spec_${col}`}
            fieldKey={col}
            fieldType={this.props.type[col]}
            policy={this.state.policy[col] || {}}
            columns={this.state.content.columns}
            onChange={v => {
              this.state.policy[col] = v;
              this.setState({policy: this.state.policy});
            }}
          />
        ))}
      </div>
    );
  }

  getTypeColumns() {
    return obj2tuples(this.props.type)
      .map(t => t[0])
      .filter(x => !['_id', '_rev', 'type']
      .includes(x))
      .sort();
  }

  renderThirdStepContent() {
    return (
      <div className="ui form">
        You are now ready to import {this.state.content.rows.length} records.
      </div>
    );
  }

  renderFourthStepContent() {
    return (
      <div className="ui form">
        Data import completed!
      </div>
    );
  }

  renderBottomNav() {
    return (
      <div className="">
        {this.state.step > 1 && this.state.step <= 3 && <button className="ui button" onClick={() => this.onBack()}>Back</button>}
        {this.state.step < 3 && <button className="ui primary button" onClick={() => this.onNextOrSubmit()}>Next</button>}
        {this.state.step == 3 && <button className="ui primary button" onClick={() => this.onNextOrSubmit()}>Submit</button>}
        {this.state.step == 4 && <button className="ui primary button" onClick={() => this.onNextOrSubmit()}>Close</button>}
      </div>
    )
  }

  onBack() {
    this.setState({step: this.state.step-1});
  }

  onNextOrSubmit() {
    if (this.state.processing) {
      return;
    }

    this.setState({processing: true, error: null}, () => {
      if (this.state.step == 1) {
        let file = this.state.files && this.state.files[0];
        if (file) {
          var reader = new FileReader();
          reader.onload = v => this.setState({content: this.parseTableFile(v.target.result)}, () => {
            this.setState({
              // Create initial policy
              policy: tuples2obj(
                this.state.content.columns
                  .map((e, i) => [e, {colIdx: ''+i}])
                  .filter(v => this.getTypeColumns().includes(v[0]))
                  .concat(
                    this.getTypeColumns()
                      .filter(v => !this.state.content.columns.includes(v))
                      .map(e => [e, {colIdx: ''}])
                  )
                  .map(tup => {
                    // Preprocessing
                    if (this.props.type[tup[0]].fieldType == 'multi_relation') {
                      tup[1]['delimiter'] = ',';
                    }
                    return tup;
                  })
              ),
              processing: false,
              step: 2,
            });
          });
          reader.onerror = v => this.setState({error: 'Error reading file.', processing: false});
          reader.readAsBinaryString(file);
        } else {
          this.setState({error: 'You need to choose a file.', processing: false})
        }
      } else if (this.state.step == 2) {
        // Validation
        var blocked = false;
        obj2tuples(this.state.policy).forEach(([pKey, pValue]) => {
          if (this.props.type[pKey].fieldType == 'multi_relation' && !pValue.delimiter) {
            this.setState({error: 'Must specify delimiter for multi relation', processing: false});
            blocked = true;
            return;
          }
        });
        if (blocked) {
          return;
        }

        this.setState({processing: false, step: 3});
      } else if (this.state.step == 3) {
        let relatedObjs = {};
        let pending = [];

        obj2tuples(this.state.policy).forEach(([pKey, pc]) => {
          if (['relation', 'multi_relation'].includes(this.props.type[pKey].fieldType)) {
            let isMulti = this.props.type[pKey].fieldType == 'multi_relation';
            let rowValues = this.state.content.rows.map(r => r[pc.colIdx]);
            let names = isMulti
              ? rowValues.map(rv => rv.split(pc.delimiter)).flat()
              : rowValues;

            pending.push(
              // TODO: Perf++: Only fetch id and rev
              findObjects({
                type: this.props.type[pKey].objectType,
                name: {$in: names},
              }).then(docs => tuples2obj(docs.map(doc => [doc.name, doc])))
                .then(docMaps => {
                  if (this.state.policy[pKey].relCreateIfMissing) {
                    let namesToCreate = [...new Set(names.filter(n => !docMaps[n]))];
                    // TODO: Perf++: Batch create objects
                    isMulti && console.log(pc.delimiter, names, namesToCreate, rowValues);
                    return Promise.all(namesToCreate.map(n => createObject({
                      type: this.props.type[pKey].objectType,
                      name: n,
                    })))
                      .then(ids => tuples2obj(ids.map((i, ii) => [namesToCreate[ii], i.id])))
                      .then(createdIdMap =>
                        isMulti
                          ? rowValues
                              .map(rv => rv
                                .split(pc.delimiter)
                                .map(n => createdIdMap[n] || docMaps[n]._id)
                              )
                          : names.map(n => createdIdMap[n] || docMaps[n]._id)
                      )
                  } else {
                    return isMulti
                      ? rowValues
                          .map(rv => rv
                            .split(pc.delimiter)
                            .filter(n => docMaps[n])
                            .map(n => docMaps[n]._id)
                          )
                      : names.map(n => docMaps[n]._id);
                  }
                })
                .then(ids => { relatedObjs[pKey] = ids; })
            );
          }
        });

        Promise.all(pending).then(() => {
          let data = this.state.content.rows.map((r, ri) =>
            tuples2obj(
              obj2tuples(this.state.policy).map(k => [
                k[0],
                relatedObjs[k[0]]
                  ? relatedObjs[k[0]][ri]
                  : r[parseInt(k[1].colIdx)]
              ]).concat([['type', this.props.type._id]])
            ),
          );

          let nameDup = this.state.policy['name'].nameDup || 'create';
          if (nameDup == 'create') {
            Promise.all(data.map(o => createObject(o)))
              .then(() => this.setState({processing: false, step: 4}));
            return;
          }

          let dataMap = tuples2obj(data.map(o => [o.name, o]));
          // TODO: Perf++: Only id and rev
          findObjects({type: this.props.type._id, name: {$in: Object.keys(dataMap)}})
            .then(docs => tuples2obj(docs.map(doc => [doc.name, doc])))
            .then(docMaps => {
              if (nameDup == 'overwrite') {
                return data.map(o => o.name in docMaps
                  ? {_id: docMaps[o.name]._id, _rev: docMaps[o.name]._rev}
                  : o
                );
              } else if (nameDup == 'skip') {
                return data.filter(o => !(o.name in docMaps));
              }
            })
            .then(objs => {
              return Promise.all(objs.map(o => createObject(o)))
            })
            .then(() => this.setState({processing: false, step: 4}));
        });
      }
    });
  }

  parseTableFile(content) {
    let wb = XLSX.read(content, {type: 'binary'});
    let raw = XLSX.utils.sheet_to_json(wb.Sheets[Object.keys(wb.Sheets)[0]], {header: 1, raw: true});

    return {
      columns: raw[0],
      rows: raw.slice(1),
    };
  }
}
