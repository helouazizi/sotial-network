package models

type RealtionUpdate struct {
	ProfileID    int    `json:"profileID"`
	ActuelStatus string `json:"status,omitempty"`
	TypeRelation string `json:"typeRelation,omitempty"`
}

type GetUsers struct {
	ProfileID int    `json:"profileID"`
	Type      string `json:"type,omitempty"`
	Limit     int    `json:"limit,omitempty"`
	Ofsset    int    `json:"ofsset,omitempty"`
}
