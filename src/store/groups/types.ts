export interface IGroup {
  id: number
  name: string
  // Include other group properties here
}

export interface IGroupState {
  groups: IGroup[]
}
