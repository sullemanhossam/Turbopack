package gql

import (
	"testing"
)

func TestGql(t *testing.T) {
	result := Gql("works")
	if result != "Gql works" {
		t.Error("Expected Gql to append 'works'")
	}
}
