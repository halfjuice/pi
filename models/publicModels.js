
const Bundle = {
  name: 'Bundle',
  types: [
    {
      _id: 'tag',
      type: 0,
      name: 'Tag',
      backgroundColor: 'color',
    },

    {
      _id: 'task',
      type: 0,
      name: 'Task',
      children: {fieldType: 'multi_relation', objectType: 'task'},
      tags: {fieldType: 'multi_relation', objectType: 'tag'},
      start: 'datetime',
      due: 'datetime',
      //workload: 'interval',
      //repeat: 'interval',
      //completed: 'bool',
      //_actions: ,
    },

    {
      _id: 'person',
      type: 0,
      name: 'Person',
      dateOfBirth: 'date',
      //employment: {fieldType: 'relation', objectType: 'employment'},
      notes: 'text',
      phone: 'text',
    },

    {
      _id: 'employement',
      type: 0,
      name: 'Employment',
      employer: 'company',
      employee: 'person',
      department: 'text',
      position: 'text',
      startDate: 'date',
      endDate: 'date',
      //term: 'term',
    },

    {
      _id: 'businessEntity',
      type: 0,
      name: 'Business Entity',
      nickName: 'text',
      //city: 'city',
      //entityType: {fieldType: 'enum', options: ['businessEntity', 'individual']},
    },

    {
      _id: 'stakeholder',
      type: 0,
      name: 'Stakeholder',
      holder: {fieldType: 'relation', objectType: 'businessEntity'},
      holdee: {fieldType: 'relation', objectType: 'businessEntity'},
    },

    {
      _id: 'company',
      type: 0,
      name: 'Company',
      subsidiaries: {fieldType: 'multi_relation', objectType: 'company'},

      relatedBusinessEntities: {fieldType: 'multi_relation', objectType: 'businessEntity'},
      relatedPeople: {fieldType: 'multi_relation', objectType: 'person'},
      //companyType: {fieldType: 'enum', options: ['company', 'individual']},

      //clientContracts: {fieldType: 'inversed_multi_relation', objectType: 'contract', fieldRef: 'customer'},
      //providerContracts: {fieldType: 'inversed_multi_relation', objectType: 'contract', fieldRef: 'provider'},

      //stockholder: {fieldType: 'inversed_multi_relation', objectType: 'funding', fieldRef: 'investee'},
      //investments: {fieldType: 'inversed_multi_relation', objectType: 'funding', fieldRef: 'investor'},

      balanceSheet: {fieldType: 'multi_relation', objectType: 'balanceSheet'},
    },

    {
      _id: 'balanceSheet',
      type: 0,
      name: 'Balance Sheet',
      date: 'date',

      totalAsset: 'currency',
      totalLiability: 'currency',
      totalEquity: 'currency',
    },

    {
      _id: 'contract',
      type: 0,
      name: 'Contract',
      customer: {fieldType: 'relation', objectType: 'company'},
      provider: {fieldType: 'relation', objectType: 'company'},
      //contractAmount: 'currency',
    },

    {
      _id: 'funding',
      type: 0,
      name: 'Funding Round',
      date: 'date',
      investor: {fieldType: 'relation', objectType: 'company'},
      investee: {fieldType: 'relation', objectType: 'company'},
      //fundingRound: {fieldType: 'enum', options: ['Angel', 'A', 'A+', 'Pre A']},
      //amount: 'currency',
    }
  ],
}
