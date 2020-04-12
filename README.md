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

1. **on** *(eventName, callback, [option], [discardAfterCall])*  
   Registers an event if it's not already registered and attaches a callback to be called every time the event is fired.    
   Returns an automatically generated, unique key that that can be passed to the `off` method to detach the callback from the event.  
   The optional `option` parameter can modify this method's behavior in several ways (see below).  

2. **one** *(eventName, callback, [option])*  
   Just like `on`, but callback will be called only once. This can be combined with the `first`, `before`, `after`, and `last` options by setting the `discardAfterCall` parameter to `true`.  
   
3. **onCalc** *(eventName, callback)*    
   Alias of `evental.on(eventName, callback, 'calc')` or `evental.on(eventName, callback, true)` - attaches the callback as the event's calculatable callback and replacing the current one if it exists. Each event can only have one calculatable callback at a time to be called and return a value every time the `calc` method is called for that event. The value returned by `calc` can also optionally be passed to the callbacks of the `on`, `first`, `before`, `after`, and `last` methods (see *Callbacks* section below)  
   
4. **first**(eventName, callback, [discardAfterCall])*    
   Alias of `evental.on(eventName, callback, 'first')` - attaches the associated callback as the first callback to be called when the event is fired. If this is called more than once on the same event, the most recently called will be first, and all preceding `first` event handlers will be converted to `before`.    
   
5. **before** *(eventName, callback, [discardAfterCall])*    
   Alias of `evental.on(eventName, callback, 'before')` - callbacks classified with this flag will be called before all callbacks except for the current `first` callback, assuming one exists, when an event is fired.  

6. **after** *(eventName, callback, [discardAfterCall])*    
   Alias of `evental.on(eventName, callback, 'after')` - callbacks classified with this flag will be called after all callbacks except for the current `last` callback, assuming one exists, when an event is fired.  
   
7. **last** *(eventName, callback, [discardAfterCall])*    
   Alias of `evental.on(eventName, callback, 'last')` - attaches the associated callback as the last callback to be called when the event is fired. If this is called more than once on the same event, the most recently called will be last, and all preceding `last` event handlers will be converted to `after`.  
   
8. **off** *(eventName, key)*  
   Detaches the callback that the key represents from the event if it exists
   
9. **fire** *(eventName, [...args])*  
   Activates the event, calling all handlers attached to it in the order they were attached, with `this` referring to the `evental` instance and passing all of the `args` to each callback. Returns the `evental` instance.
   
10. **calc** *(eventName, [...args])*  
   Activates the calculatable event, calling the calculatable function attached to the event if it exists, with `this` referring to the `evental` instance and passing all of the arguments to the callback. Returns the return value of the callback.
   
   *Both `fire` and `calc` can be called multiple times.*  
   
11. **get** *(eventName)*  
   Returns the individual `EventalEvent` instance for the named event if it exists.

12. **count** *(eventName)*  
   Returns the current number of times the event has been fired or calculated.
   
13. **getEvent** *(eventName, [key])*  
   If `key` is given, returns the specific callback function the key represents, otherwise returns all functions attached to the event
   
14. **getCalc** *(eventName)*  
   Returns the calculatable function attached to the event or `null` if none exists
   
15. **setCaller** *(caller)*  
   Sets the `this` value of all event callbacks to the object represented by `caller`.  

16. **bypass** *(eventName)*  
   For events where there is a calculatable callback set, you can call this function to prevent the calculated value being passed to the event stack when the named event is fired. Calling `bypass` will guarantee that the arguments passed to the `fire` method will always be the arguments passed to the callbacks in the event stack. You can disable `bypass` at any time by calling `evental.removeBypass(eventName)`.  

###### Callbacks  
The second parameter of the `on`, `onCalc`, `first`, `before`, `after`, and `last` methods is always the callback, much as it is in other event handlers. In the callback, `this` defaults to the Evental instance, but you can change that by passing a different caller into the Evental constructor, or at any time by setting the value of `evental.caller`.  
Pass parameters into the `evental.fire` method that will then be available in every callback for the event, with one exception:
If the event has an active calculatable callback (called using `evental.onCalc` or by calling `evental.on` with the third parameter set to `calc` or `true`), `evental.calc` will silently be called before cycling through the event stack, then the returned value of `calc` will be passed to the callbacks rather than the arguments passed in the `fire` method. If you want to use `calc` on an event for other reasons and don't want the returned value passed to the event stack, you can bypass this default behavior by calling `eventalevent.bypass(eventName)`.  
   
###### Examples:  
Bind an existing event:
```javascript
document.addEventListener('click', e => {
   evental.fire('click', e); 
});

document.getElementById('myButton').addEventListener('click', e => {
   evental.fire('myButtonClick', e); 
});
```
Conditionally fire several events at once:
```javascript
function onComplete(request) {
    if (request.status == 'success') {
        evental.fire(['success', 'complete'], request.data);
    } else {
        evental.fire(['error', 'complete'], request.error);
    }
}
```
Control the order in which events are called:
```javascript
let order = [];
evental.after('order', () => {
   order.push(4);
});

evental.on('order', () => {
    order.push(3);
});

evental.last('order', () => {
    order.push(5);
});

evental.first('order', () => {
    order.push(1); 
});

evental.before('order', () => {
    order.push(2); 
});

evental.fire('order');

// Result: order == [1,2,3,4,5];
```
Mutate data before passing to the next step:
```javascript
evental.onCalc('chunkReady', (data, number) => {
   console.log(`Data Chunk ${number}: ${JSON.stringify(data)}`); 
});
let chunkNumber = 0;
stream.on('data', data => {
    chunkNumber++;
    data = evental.calc('chunkReady', data, chunkNumber);
    return data;
}
```
Use the `one` method to set a callback to run once, then reactivate the callback later
```javascript
let signedIn = evental.one('activity', () => {
   alert('User is signed in.');
});
// Do stuff

evental.fire('activity'); // alert('User is signed in.')
evental.on('signOut', () => {
   evental.one('activity', signedIn); 
});

evental.fire('activity'); // no alert
evental.fire('signOut');
// Do stuff
evental.fire('activity'); // alert('User is signed in.')
```
