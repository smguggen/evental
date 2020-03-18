# Srcer Events

![Workflow Status](https://img.shields.io/github/workflow/status/srcer/events/Build)
![Version](https://img.shields.io/npm/l/@srcer/events?style=plastic)
![License](https://img.shields.io/github/license/srcer/events)
![Size](https://img.shields.io/bundlephobia/min/@srcer/events)

Simple, environment-agnostic event handling. Use Srcer Events to create and handle custom events that don't depend on the existence of the DOM or Node and can be used in just about any environment.

Install
-------
```console
npm install @srcer/events
```

Include
-------
```javascript
// get Events class
const Events = require('@srcer/events');

// get new Events instance
const events = new Events();

// or get the instance in one step
const events = require('@srcer/events').instance;
```
In html:
```html
<script type="text/javascript" src="/node_modules/@srcer/events/dist/events.min.js"></script>
```

###### Properties:

1. **instance** *(static)*  
   Returns a new instance of the Events class with no events attached
   
2. **state**  
   Returns the current state of events in the form of an object keyed by the event names referencing an object with two properties:
   * **handlers**: an array of key names representing each callback function to be called when the event fires, or an empty array if none
   * **calc**: the key representing the calculatable function (see below) attached to the event or null if none
    
3. **events**  
   Returns an array with the names of all of the currently registered events
   
###### Methods:

1. **on** *(eventName, callback, [calculatable])*  
   If no `calculatable` parameter is given or if the parameter is falsy, registers an event in the class if not already registered and attaches a callback to be called every time the event is fired.
      
   If `calculatable` is truthy, it attaches the callback as the event's calculatable callback. Each event can only have one calculatable callback at a time to be called and return a value every time the `calc` method is called for that event.
   
   Both versions return the unique key that is automatically generated and attached to the callback for use in referring to the callback in the `off` method to detach the callback from the event

2. **onCalc** *(eventName, callback)*    
   Equivalent to calling `events.on(eventName, callback, true)` - names the callback as the calculatable function for the event, replacing the current one if it exists
   
3. **off** *(eventName, key)*  
   Detaches the callback that the key represents from the event if it exists
   
4. **fire** *(eventName, [...args])*  
   Activates the event, calling all handlers attached to it in the order they were attached, with `this` referring to the `events` instance and passing all of the `args` to each callback. Returns the `events` instance.
   
5. **calc** *(eventName, [...args])*  
   Activates the calculatable event, calling the calculatable function attached to the event if it exists, with `this` referring to the `events` instance and passing all of the `args` to the callback. Returns the return value of the callback.
   
   *Both `fire` and `calc` can be called multiple times.*
   
6. **getEvent** *(eventName, [key])*  
   If `key` is given, returns the specific callback function the key represents, otherwise returns all functions attached to the event
   
7. **getCalc** *(eventName)*  
   Returns calculatable function attached to event or null if none exists



