import express from "express"
import dotenv from "dotenv"

dotenv.config();
const app = express();


const PORT = process.env.PORT;

app.use(express.json())

const rooms = [
    {
      name: "1BHK",
      seats: 10,
      amenities: "wifi,projection screen,AC",
      price: 15000,
      roomId: "101",
      bookingDetails: [
        {
          customerName: "Sandeep",
          date: new Date("2022-1-20"),
          start: "07:00",
          end: "10:00",
          status: "confirmed",
        },
      ],
    },
    {
      name: "2BHK",
      seats: 15,
      amenities: "wifi,projection screen,AC",
      price: 25000,
      roomId: "def",
      bookingDetails: [
        {
          customerName: "kuldeep",
          date: new Date("2022-1-19"),
          start: "15:00",
          end: "17:00",
          status: "Payment Pending",
        },
      ],
    },
  ];

app.get("/", (req, res) => {
    res.status(200).send("Server is running SSuccessfully ");
  });

//create room
app.post("/createRoom", (req, res) => {
  rooms.push({
    name: req.body.name,
    seats: req.body.seats,
    amenities: req.body.amenities,
    price: req.body.price,
    roomId: "ghi",
    bookingDetails: [{}],
  });
  res.status(200).send("Room Created");
});


//Book rooms
app.post("/bookRoom", (req, res, next) => {
  for (let i = 0; i < rooms.length; i++) {
    console.log("a");
    if (!(rooms[i].roomId === req.body.roomId)) {
      return res.status(400).send({ error: "Invalid" });
    } else {
      let booking = {
        customerName: req.body.name,
        date: new Date(req.body.date),
        start: req.body.start,
        end: req.body.end,
        status: "confirmed",
      };
      let result = undefined;
      rooms[i].bookingDetails.forEach((book) => {
        if (
          book.date.getTime() == booking.date.getTime() &&
          book.start === booking.start
        ) {
          result = 0;
          console.log("in booking");
        } else {
          result = 1;
          rooms[i].bookingDetails.push(booking);
        }
      });
      if (result) return res.status(200).send("Booking confirmed");
      else
        return res
          .status(400)
          .send({ error: "Please select different time slot" });
    }
  }
});

app.get("/listCustomer", (req, res) => {
  let customerArray = [];

  rooms.forEach((room) => {
    let customerObj = { roomName: room.name };

    room.bookingDetails.forEach((customer) => {
      customerObj.customerName = customer.customerName;
      customerObj.date = customer.date;
      customerObj.start = customer.start;
      customerObj.end = customer.end;

      customerArray.push(customerObj);
    });
  });

  res.send(customerArray);
});


app.get("/listRooms", (req, res) => {
  console.log("list rooms");
  res.status(200).send(rooms);
});

app.listen(PORT, () => console.log("App started in ", PORT))
