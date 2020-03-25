# Srcer Events

![Workflow Status](https://img.shields.io/github/workflow/status/srcer/events/Build?style=plastic)
![Version](https://img.shields.io/npm/v/@srcer/events?style=plastic)
![License](https://img.shields.io/github/license/srcer/events?style=plastic)
![Size](https://img.shields.io/bundlephobia/min/@srcer/events?style=plastic)

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
```
In html:
```html
<script type="text/javascript" src="/node_modules/@srcer/events/dist/srcer-events.min.js"></script>
```

###### Instantiate:
You can get a new `Srcer Events` instance in one of two ways:
```javascript
const events = new Events(caller);
```
*Or:*
```javascript
const events = require('@srcer/events').instance;
```

###### Properties:
1. **instance** *(static)*  
   Returns a new instance of the Events class with no events attached and `this.caller` set to the Srcer Events object
   
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
   
   In the callback `this` defaults to the Srcer Events instance, but you can change that by passing a different caller into the Srcer Events constructor, or at any time by setting the value of `events.caller`

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



