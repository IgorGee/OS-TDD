# Create an Operating System

## Tasks
Ask user about the system

    $ How much memory does your system have? (in bytes, max: 4 Billion)
    $ Memory: 2000000000
    $
    $ How many hard disks does your system have?
    $ Disks: 2
    $
    $ How many printers are connected to this system?
    $ Printers: 1

## Given:
  The system is single-core CPU

## Key Inputs

### A

  New process has arrived

  Tip: name the ids incrementally, and do not reuse the id when the program terminates
  1. Ask user for the process size (in bytes)
  2. Ask user for the Process Priority (higher number higher priority)

### t

  Currently running process on CPU is terminated

### p &lt;int&gt;

  The currently running process on CPU has requested to use printer <int>

  1. Ask for file name to print.

### P &lt;int&gt;

  An interrupt from the printer saying that the printing job is finished

### d &lt;int&gt;

  The currently running process has requested to do some disk operation on disk &lt;int&gt;

  1. Ask for file name to read.

### D &lt;int&gt;

  An interrupt from the disk number that the disk job is done

### Sr

  Show the ready-queue and current process on CPU

### Si

  Show information about all I/O devices

### Sm

  Show information about memory
  - Where in memory different processes are located
  - "Best-fit" Allocation
  - cannot create an array of 4 Billion

  E.g.

    Bytes 0-999 Belong to process 1

    Bytes 1000-1499 Belong to process 2

## Extra info

CPU Scheduling

  - Preemptive Priority Scheduling

I/O Scheduling

  - FIFO

Memory Management

  - "Best Fit"
  - If no room in memory, refuse the process

## Example

    $ >> A
    $    Size: 1000
    $    Priority: 5
    $ >>
    $ >> A
    $    Size: 1600
    $    Priority: 7
    $ >>
    $ >> Sr
    $    CPU: pid 2
    $    Ready: pid 1
    $ >> p1
    $    File Name: "asdf.txt"
    $ >> Sr
    $    CPU: pid 1
    $    Ready: none
    $ >> Si
    $    Printer1: pid 2: "asdf.txt"
    $    Disk1: none
    $    Disk2: none (can avoid printing anything about empty devices)
    $ >> P1
    $ >> Sr
    $    CPU: pid 2
    $    Ready: pid 1
    $ >> Si
    $ >> A
    $    Size: 1000
    $    Priority: 6
    $ >> Sr
    $    CPU: pid 2
    $    Ready: pid 3, pid 1
    $ >> t
    $ >> Sr
    $    CPU: pid 3
    $    Ready: pid 1
    $ >> Sm
    $    0-1024: P1
    $    1525-2524: P3
    $ >> A
    $    Size: 400
    $    Priority: 2
    $ >> Sm
    $    0-1024: P1
    $    1025-1424: P4
    $    1525-2524: P3
