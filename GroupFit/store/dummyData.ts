const data = [
    {
      groupTitle: "Gym Class",
      color: "#dec4ff",
      tasks: [
        {
          id: 1,
          title: "Warm-up",
          startDate: "Tue, 18 Jun",
          startTime: "08:00",
          endDate: "Tue, 18 Jun",
          endTime: "08:10",
          location: "Gym Room 1",
          grouping: "Gym Class",
          notes: "Stretch all major muscle groups",
          priority: "important",
          notification: "Tue, 18 Jun 07:50",
          personalId: 101,
          completedById: 201, // ID of the person who completed the task
          assignedToId: 101, // ID of the person assigned the task (same as personalId if personal task)
        },
        {
          id: 2,
          title: "Cardio",
          startDate: "Tue, 18 Jun",
          startTime: "08:30",
          endDate: "Tue, 18 Jun",
          endTime: "09:00",
          location: "Gym Room 1",
          grouping: "Gym Class",
          notes: "30 minutes on treadmill",
          priority: "very important",
          notification: "Tue, 18 Jun 08:20",
          personalId: 101,
          assignedToId: 101, // ID of the person assigned the task (same as personalId if personal task)
        },
      ],
    },
    {
      groupTitle: "Agile Group Project",
      color: "#c4dfff",
      tasks: [
        {
          id: 1,
          title: "Sprint Planning",
          startDate: "Wed, 19 Jun",
          startTime: "10:00",
          endDate: "Wed, 19 Jun",
          endTime: "11:00",
          location: "Conference Room A",
          grouping: "Agile Group Project",
          notes: "Plan tasks for the next sprint",
          priority: "important",
          notification: "Wed, 19 Jun 09:50",
          personalId: 102,
          assignedToId: 103, // ID of the person assigned the task
        },
        {
          id: 2,
          title: "Code Review",
          startDate: "Thu, 20 Jun",
          startTime: "14:00",
          endDate: "Thu, 20 Jun",
          endTime: "15:00",
          location: "Conference Room B",
          grouping: "Agile Group Project",
          notes: "Review code with team",
          priority: "very important",
          notification: "Thu, 20 Jun 13:50",
          personalId: 102,
          assignedToId: 103, // ID of the person assigned the task
        },
      ],
    },
  ];
  
  export { data };