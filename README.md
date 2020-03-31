# Evental

![Workflow Status](https://img.shields.io/github/workflow/status/smguggen/evental/Build?style=plastic)
![Downloads](https://img.shields.io/npm/dt/@srcer/events?style=plastic)
![Version](https://img.shields.io/npm/v/evental?style=plastic)
![License](https://img.shields.io/npm/l/evental?style=plastic)
![Size](https://img.shields.io/bundlephobia/min/evental?style=plastic)

Simple, environment-agnostic event handling. Use Evental to create and handle custom events that don't depend on the existence of the DOM or Node and can be used in just about any environment.

Install
-------
```console
npm install evental
```

Include
-------
```javascript
// get Evental class
const Evental = require('evental');
```
In html:
```html
<script type="text/javascript" src="/node_modules/evental/dist/evental.min.js"></script>
<script type="module" src="/node_modules/evental/dist/evental.es.js"></script>
```

###### Instantiate:
You can get a new `Evental` instance in one of two ways:
```javascript
const evental = new Evental(caller);
// or:
const evental = require('evental').instance;
```

###### Properties:
1. **instance** *(static)*  
   Returns a new instance of the Evental class with no events attached and `evental.caller` set to the Evental object
   
2. **state**  
   Returns the current state of events in the form of an object keyed by the event names referencing an object with two properties:
   * **handlers**: an array of key names representing each callback function to be called when the event fires, or an empty array if none
   * **calc**: the key representing the calculatable function (see below) attached to the event or null if none
    
3. **events**  
   Returns an array with the names of all of the currently registered events
   
###### Methods:

1. **on** *(eventName, callback, [option])*  
   Registers an event if it's not already registered and attaches a callback to be called every time the event is fired.    
   Returns an automatically generated, unique key that that can be passed to the `off` method to detach the callback from the event.     
   In the callback, `this` defaults to the Evental instance, but you can change that by passing a different caller into the Evental constructor, or at any time by setting the value of `evental.caller`
   The optional `option` parameter can modify this method's behavior in several ways (see below).  
   
2. **onCalc** *(eventName, callback)*    
   Alias of `evental.on(eventName, callback, 'calc')` or `evental.on(eventName, callback, true)` - attaches the callback as the event's calculatable callback and replacing the current one if it exists. Each event can only have one calculatable callback at a time to be called and return a value every time the `calc` method is called for that event. 
   
3. **first**(eventName, callback)*    
   Alias of `evental.on(eventName, callback, 'first')` - attaches the associated callback as the first callback to be called when the event is fired. If this is called more than once on the same event, the most recently called will be first, and all preceding `first` event handlers will be converted to `before`.    
   
4. **before** *(eventName, callback)*    
   Alias of `evental.on(eventName, callback, 'before')` - callbacks classified with this flag will be called before all callbacks except for the current `first` callback, assuming one exists, when an event is fired.  

5. **after** *(eventName, callback)*    
   Alias of `evental.on(eventName, callback, 'after')` - callbacks classified with this flag will be called after all callbacks except for the current `last` callback, assuming one exists, when an event is fired.  
   
6. **last** *(eventName, callback)*    
   Alias of `evental.on(eventName, callback, 'last')` - attaches the associated callback as the last callback to be called when the event is fired. If this is called more than once on the same event, the most recently called will be last, and all preceding `last` event handlers will be converted to `after`.  
   
7. **off** *(eventName, key)*  
   Detaches the callback that the key represents from the event if it exists
   
8. **fire** *(eventName, [...args])*  
   Activates the event, calling all handlers attached to it in the order they were attached, with `this` referring to the `evental` instance and passing all of the `args` to each callback. Returns the `evental` instance.
   
9. **calc** *(eventName, [...args])*  
   Activates the calculatable event, calling the calculatable function attached to the event if it exists, with `this` referring to the `evental` instance and passing all of the arguments to the callback. Returns the return value of the callback.
   
   *Both `fire` and `calc` can be called multiple times.*  
   
10. **getEvent** *(eventName, [key])*  
   If `key` is given, returns the specific callback function the key represents, otherwise returns all functions attached to the event
   
11. **getCalc** *(eventName)*  
   Returns the calculatable function attached to the event or `null` if none exists
   
12. **setCaller** *(caller)*  
   Sets the `this` value of all event callbacks to the object represented by `caller`.  



