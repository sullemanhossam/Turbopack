package dataaccess

import (
	"testing"
)

func TestDataAccess(t *testing.T) {
	result := DataAccess("works")
	if result != "DataAccess works" {
		t.Error("Expected DataAccess to append 'works'")
	}
}
