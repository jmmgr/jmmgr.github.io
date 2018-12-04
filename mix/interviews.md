# Template

## Content

<!-- toc -->

- [Introduction](#introduction)

<!-- tocstop -->

## Introduction

__Write a piece of code to create a Fibonacci sequence using recursion.__
```
function fibonnaci(n) {
	if (n === 1 || n === 2)
		return 1;
	else 
		return fibonnaci(n-1)+fibonnaci(n-2);
}
```
__Write a piece of code to create a Fibonacci sequence using the iterative method.__
```
function fibonnaci(n) {
	const arr = [undefined, 1, 1];
	if (n <=2) {
		return arr[n];
	}
	for (let i =3; i <=n; i++) {
		arr[i] = arr[i-1] + arr[i-2];
	}
	return arr[n];
}
```

__Write a piece of code to determine whether a number is a palindrome.__
We can do in 2 ways, transform it into a string, and check the same as usually with a string.
Or reverse the number and compare with the old one we can reverse as:
```
function reverse(n) {
	let new_number = 0;
	while (n > 0) {
		const dig = n%10;
		n = Math.floor(n/10);
		new_number = new_number * 10 + dig;
	}
	return new_number;
}
```

__Write a piece of code to determine whether two words are anagrams.__

We can do 2 hashmaps, counting how many times a character appears. Then check if they are the same.

__Write a piece of code to determine whether a binary tree is a binary search tree or not.__

We have to check each node if current value is better that the max and min of its descendants, and then check for each element.

```
function isBST(root, node_min, node_max) 
{ 
    if (!root) 
        return true; 
  
    if (node_min && root.data < node_min.data) 
        return false; 
  
    if (node_max && root.data > node_max.data) 
        return false; 
  
// We write the min and the max of each node
// in the case of going left, the max is the root, the min the same as before
// in the case of the right, the min is the root, and the max same as before
    return isBST(root.left, node_min, root) && 
           isBST(root.right, root, node_max); 
} 
```

Another way we can do is, do a inorder iteration into an array, and check if ordered.
Or just keep track of the previos node in a inorder, and check if is less.

__Write a piece of code to combine fractions from two arrays into a single array.__
Not sure of the question


__You have a ladder of X steps. You can go up the ladder by taking either one or two steps each time. Write a function to determine how many potential different combinations of one or two steps you could take to the top of the ladder.__
```
function steps (x) {
	if (x === 1)
		return 1; // one way to arrive at step 1
	if (x === 2)
		return 2; // Two ways to arrive at step 2

	return steps(x-1) + steps(x-2);
}
```

__Given two strings 'X' and 'Y', find the length of the longest common substring.__
The best time would be to do the KMP algorithm O(n+m). But is not easy to remember.

Another option is to create an array and write down how many elements match. 

```
function commonSubstring(X, Y) { 
	const arr = [];
    let result = 0;  // To store length of the longest common substring 
      
    for (let i = 0; i <= X.length; i++) { 
        for (let j = 0; j <= Y.length; j++) { 
            if (i == 0 || j == 0){ // we ignore the 0 elments we will proccess them later
				arr[i] = [];
                arr[i][j] = 0; 
			} else if (X.charAt(i - 1) == Y.charAt(j - 1)) { 
                arr[i][j] = arr[i - 1][j - 1] + 1; 
                result = Math.max(result, arr[i][j]); 
            }  
            else
                arr[i][j] = 0; 
        } 
    } 
    return result; 
} 
```

__Why is a binary tree better than a hash table?__
If you want to iterate the values any way, (inorder) you can do it with a binary tree.
If you want to find the max value. If is BST, is easy to find.
For Binary tree we don't need third party hashes
You don't need to do hashmap resize (maybe you want to swich to a better hash, and need to redo all the elements).
Hash may be expensive.
Hash inneficient if a lot of collitions.

__Why is a hash table better than a binary tree?__

The access is faster O(n) vs O(logn).
The insertion and delete as well are faster.
Balance the tree is costly.

__What's the difference between a process and a thread?__
Process:

- An executing instance of a program is called a process.
- Some operating systems use the term ‘task‘ to refer to a program that is being executed.
- A process is always stored in the main memory also termed as the primary memory or random access memory.
- Therefore, a process is termed as an active entity. It disappears if the machine is rebooted.
- Several process may be associated with a same program.
- On a multiprocessor system, multiple processes can be executed in parallel.
- On a uni-processor system, though true parallelism is not achieved, a process scheduling algorithm is applied and the processor is scheduled to execute each process one at a time yielding an illusion of concurrency.
- Example: Executing multiple instances of the ‘Calculator’ program. Each of the instances are termed as a process.

Thread:

- A thread is a subset of the process.
- It is termed as a ‘lightweight process’, since it is similar to a real process but executes within the context of a process and shares the same resources allotted to the process by the kernel.
- Usually, a process has only one thread of control – one set of machine instructions executing at a time.
- A process may also be made up of multiple threads of execution that execute instructions concurrently.
- Multiple threads of control can exploit the true parallelism possible on multiprocessor systems.
- On a uni-processor system, a thread scheduling algorithm is applied and the processor is scheduled to run each thread one at a time.
- All the threads running within a process share the same address space, file descriptors and other process related attributes.
- Since the threads of a process share the same memory, synchronizing the access to the shared data within the process gains unprecedented importance.

__When would you use a thread instead of a process?__
If you want use all the CPUS of a machine, best separate into different threads.
If you want to share the memory to synchronize the access to data.

__How does garbage collection work in Java?__
Garbage Collector is a dameon thread. A dameon thread runs behind the application. It is started by JVM. The thread stops when all non-dameon threads stop.

The garbage collector is under the control of the JVM. The JVM decides when to run the garbage collector. From within your Java program, you can ask the JVM to run the garbage collector, but there are no guarantees, under any circumstances, that the JVM will comply. Left to its own devices, the JVM will typically run the garbage collector when it senses that memory is running low. Experience indicates that when your Java program makes a request for garbage collection, the JVM will usually grant your request in short order, but there are no guarantees. Just when you think you can count on it, the JVM will decide to ignore your request.

If you want to customize it, you can change the JVM and use a new one (as a plugin).

__What are the differences between JS Angular and JS React? Which do you prefer?__

__What differentiates propositional logic from first order logic? Which is better?__
No idea.

__When should you use functional programming vs. objected oriented programming?__
    Object-oriented languages are good when you have a fixed set of operations on things, and as your code evolves, you primarily add new things. This can be accomplished by adding new classes which implement existing methods, and the existing classes are left alone.

    Functional languages are good when you have a fixed set of things, and as your code evolves, you primarily add new operations on existing things. This can be accomplished by adding new functions which compute with existing data types, and the existing functions are left alone.

When evolution goes the wrong way, you have problems:

- Adding a new operation to an object-oriented program may require editing many class definitions to add a new method.
 - Adding a new kind of thing to a functional program may require editing many function definitions to add a new case.


__How could you set up a recursive function so that a smart language / compiler could evaluate the function and never run out of memory?__
Have a depth counter???
or if there is too many executing wait?

__Here is a file of employee names, presented as a string. It contains first names and last names. Write a piece of code to returns the most common last name in the list. Consider the complexity of your program: it will need to handle a large dataset in a small amount of time.__
Max heap.

__Talk me through the concept of inheritance in Java.__
Inheritance in Java is a mechanism in which one object acquires all the properties and behaviors of a parent object. It is an important part of OOPs (Object Oriented programming system).

The idea behind inheritance in Java is that you can create new classes that are built upon existing classes. When you inherit from an existing class, you can reuse methods and fields of the parent class. Moreover, you can add new methods and fields in your current class also.

Why?
- For Method Overriding (so runtime polymorphism can be achieved).
- For Code Reusability.

__Talk me through the Java design patterns you know.__

__What's a Linked List? Can you build one?__
A linkendis is a data structure where a node has a pointer to the next one.

__How can you speed up a database query?__
- Explain the query. To make sure you are using the right indexes or need create new ones.
- denormalize the data, even if we repeat the data, a common query may be more efficient.

__What's the difference between Java Heap Space and Stack Memory?__

Java Heap space is used by java runtime to allocate memory to Objects and JRE classes. Whenever we create any object, it’s always created in the Heap space.
Garbage Collection runs on the heap memory to free the memory used by objects that doesn’t have any reference. Any object created in the heap space has global access and can be referenced from anywhere of the application.

Java Stack memory is used for execution of a thread. They contain method specific values that are short-lived and references to other objects in the heap that are getting referred from the method.
Stack memory is always referenced in LIFO (Last-In-First-Out) order. Whenever a method is invoked, a new block is created in the stack memory for the method to hold local primitive values and reference to other objects in the method.
As soon as method ends, the block becomes unused and become available for next method.
Stack memory size is very less compared to Heap memory.

- Heap memory is used by all the parts of the application whereas stack memory is used only by one thread of execution.
- Whenever an object is created, it’s always stored in the Heap space and stack memory contains the reference to it. Stack memory only contains local primitive variables and reference variables to objects in heap space.
- Objects stored in the heap are globally accessible whereas stack memory can’t be accessed by other threads.
- Memory management in stack is done in LIFO manner whereas it’s more complex in Heap memory because it’s used globally. Heap memory is divided into Young-Generation, Old-Generation etc, more details at Java Garbage Collection.
- Stack memory is short-lived whereas heap memory lives from the start till the end of application execution.
- We can use -Xms and -Xmx JVM option to define the startup size and maximum size of heap memory. We can use -Xss to define the stack memory size.
- When stack memory is full, Java runtime throws java.lang.StackOverFlowError whereas if heap memory is full, it throws java.lang.OutOfMemoryError: Java Heap Space error.
- Stack memory size is very less when compared to Heap memory. Because of simplicity in memory allocation (LIFO), stack memory is very fast when compared to heap memory.

__How would you find the middle element in a Linked List?__
Fast and slow pointer.

__Find the maximum value in this binary tree.__
??

__What are abstract classes in Java? What's their purpose?__
Abstract classes allows to decide basic functionality, or force to have certain implementation (using final in a method). Is like a contract where you can define some behaviours.
Then you can override the methods (as long as they are not final).

__What is overloading an interface? Why would you do that?__


__How would you write a programme to find the biggest number in a list of 10 numbers?__
If they are ordered asc, get the last one or first one.
If not, just loop through the array, and save the max number in a variable.

__What's Object Oriented Programming?__
Is a programming paradigm based on the concept of "objects", which may contain data, in the form of fields, often known as attributes; and code, in the form of procedures, often known as methods

__How does Object Oriented Programming differ from Process Oriented Programming?__
Object-Oriented Language
- Core concept is objects (consider a car)
- Objects have properties that define them, they can be constant or changing (a car is red, 2004 model, and has cruise control. It also currently has 100K on the odometer and 3/4 tank fuel)
objects can be sent messages which affect it (a car can be driven from A to B, a car can be refueled)

Procedural Language

 - Core concept is process (consider placing on online order)
 - For a process to complete it must go through several steps (an order must be (1) sent to warehouse, (2) boxed, and (3) shipped)
 - One of the steps might be a process by itself, or it can be atomic


__What's polymorphism in OOP?__
Polymorphism is when you can treat an object as a generic version of something, but when you access it, the code determines which exact type it is and calls the associated code.

__What's inheritance in OOP?__
An object created through inheritance (a "child object") acquires all the properties and behaviors of the parent object (except: constructors, destructor, overloaded operators and friend functions of the base class)

__Write a piece of code to find the square root of a double number.__

__If you had to make a program that could vote for the top three funniest people in the office how would you do that? How would you make it possible to vote on those people?__
Do a webform, and api that receives the vote, save in DB.

__What's role-based access control? How would you implement it?__

__How do you calculate linear regression using the least squares method?__


__Basic Java__
Abstract method -> method without implemenation.
An interface is implicitly abstract. You do not need to use the abstract keyword while declaring an interface.
Each method in an interface is also implicitly abstract, so the abstract keyword is not needed.
Methods in an interface are implicitly public.
You cannot instantiate an interface. An interface does not contain any constructors. All of the methods in an interface are abstract.  
An interface cannot contain instance fields. The only fields that can appear in an interface must be declared both static and final.
An interface is not extended by a class; it is implemented by a class.
An interface can extend multiple interfaces.
A subclass inherits all the members (fields, methods, and nested classes) from its superclass. Constructors are not members, so they are not inherited by subclasses, but the constructor of the superclass can be invoked from the subclass.
You can access to the superclas methods and variables with super. super.method, super.variable.
Java doesn't support multiple inheritance (a class only can extend 1 other class. it supports multi level inheritance).

__overriding__
The argument list should be exactly the same as that of the overridden method.
The return type should be the same or a subtype of the return type declared in the original overridden method in the superclass.
The access level cannot be more restrictive than the overridden method's access level. For example: If the superclass method is declared public then the overridding method in the sub class cannot be either private or protected.
Instance methods can be overridden only if they are inherited by the subclass.
A method declared final cannot be overridden.
A method declared static cannot be overridden but can be re-declared.
If a method cannot be inherited, then it cannot be overridden.
A subclass within the same package as the instance's superclass can override any superclass method that is not declared private or final.
A subclass in a different package can only override the non-final methods declared public or protected.
An overriding method can throw any uncheck exceptions, regardless of whether the overridden method throws exceptions or not. However, the overriding method should not throw checked exceptions that are new or broader than the ones declared by the overridden method. The overriding method can throw narrower or fewer exceptions than the overridden method.
Constructors cannot be overridden.

__virtual methods__
In C++ virtual methods are those who can be overrided by the subsclass and decided in running time.
In Java, all non-static methods are by default "virtual functions." Only methods marked with the keyword final, which cannot be overridden, along with private methods, which are not inherited, are non-virtual.
This is very related with Polymorphism.

__abstract class__
Abstract classes may or may not contain abstract methods, i.e., methods without body ( public void get(); )
But, if a class has at least one abstract method, then the class must be declared abstract.
If a class is declared abstract, it cannot be instantiated.
To use an abstract class, you have to inherit it from another class, provide implementations to the abstract methods in it.
If you inherit an abstract class, you have to provide implementations to all the abstract methods in it.

__Four fundamentals of Object Oriented Programming OOP__
- inheritance --> One class acquires the properties (methods and fields) of another
- abstraction --> hide the implementation, only provide the functionality
- encapsulation --> data hiding.  Wrapping the data (variables) and code acting on the data (methods) together as a single unit.
- polymorphism --> Object many forms, most common is when a parent class reference is used to refer to a child class object.

__private public protected 'no modifier'__
public --> Accessed for everyone.
protected -->  The member can only be accessed within its own package (as with package-private) and, in addition, by a subclass of its class in another package.
no modifier ->  it is visible only within its own packag
private -> Only in the same class


__Threads in java__
There are 2 ways to implement Threads in java, implement a Interface or extends a class (Thread from java.lang).
Once we extend/implement we need to implement the method run:
```
public void run() {
}
```
Then we need to create a Thread:
```
Thread(Runnable threadObj, String threadName);
// threadObj is a runable instance (the one extend/implement the Thread)
```
Then just call start() the thread
```
t = new Thread (this, threadName);
t.start ();
```

You can sleep it at any time
```
Thread.sleep(1); // Is static method, puts the current Thread to sleep for X milliseconds
```

public void wait() // Causes the current thread to wait until another thread invokes the notify().

public void notify()// Wakes up a single thread that is waiting on this object's monitor.


States of the Threads:
- new -> after you created but didn't started it.
- runnable -> after start()
- running -> after run()
- waiting -> after sleep() or wait()
- dead -> after end of the execution


You can set Priority to a thread 1 to 10, being 10 the biggest.
You can create locks using syncronized(Lock1)
This is an example of a deadLock:
```
public class TestThread {
   public static Object Lock1 = new Object();
   public static Object Lock2 = new Object();
   
   public static void main(String args[]) {
      ThreadDemo1 T1 = new ThreadDemo1();
      ThreadDemo2 T2 = new ThreadDemo2();
      T1.start();
      T2.start();
   }
   
   private static class ThreadDemo1 extends Thread {
      public void run() {
         synchronized (Lock1) {
            System.out.println("Thread 1: Holding lock 1...");
            
            try { Thread.sleep(10); }
            catch (InterruptedException e) {}
            System.out.println("Thread 1: Waiting for lock 2...");
            
            synchronized (Lock2) {
               System.out.println("Thread 1: Holding lock 1 & 2...");
            }
         }
      }
   }
   private static class ThreadDemo2 extends Thread {
      public void run() {
         synchronized (Lock2) {
            System.out.println("Thread 2: Holding lock 2...");
            
            try { Thread.sleep(10); }
            catch (InterruptedException e) {}
            System.out.println("Thread 2: Waiting for lock 1...");
            
            synchronized (Lock1) {
               System.out.println("Thread 2: Holding lock 1 & 2...");
            }
         }
      }
   } 
}
```

__exceptions in java__
There are 3 types of exceptions in java, all of them are subclases of Throwable:
- Checked exceptions, this are at compilation time. (Example can't read a file FileNotFoundException).
- Unchecked exceptions, happens at runtime. (Example adding an element in an array ArrayIndexOutOfBoundsException).
- Erross, happens at runtime, but nothing to be done (StackOverflow).
Checked and Unchecked extenss from Exceptions who extens from Throwable.
Errors extends directly from Throwable.

__why java is platform independent__
Source code -> javac -> Universal byte code 
Universal byte -> jvm/java -> execute them on a particular machine.
