package models

type RealtionUpdate struct {
	ProfileID    int    `json:"profileID"`
	ActuelStatus string `json:"status,omitempty"`
	TypeRelation string `json:"typeRelation,omitempty"`
}
