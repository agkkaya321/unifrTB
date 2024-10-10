package models

import "errors"

type Queue struct {
	elements []interface{}
}

func (q *Queue) Enqueue(element interface{}) {
	q.elements = append(q.elements, element)
}

func (q *Queue) Dequeue() (interface{}, error) {
	if q.IsEmpty() {
		return nil, errors.New("queue is empty")
	}
	element := q.elements[0]
	q.elements = q.elements[1:]
	return element, nil
}

func (q *Queue) IsEmpty() bool {
	return len(q.elements) == 0
}
