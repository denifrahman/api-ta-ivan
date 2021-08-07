const amqp = require('amqplib')
amqp.connect('amqp://localhost')
    .then(conn => {
        return conn.createChannel().then(ch => {
            const msg = 'Hello world!'    // Isi pesan yang dikirim ke RabbitMQ
            const array = {
                name: "Kiddy",
                job: "Programmer",
            }
            var pubChannel = null;
            var offlinePubQueue = [];
            var exchange = 'my-delay-exchange';
            pubChannel = ch;
            //assert the exchange: 'my-delay-exchange' to be a x-delayed-message,
            pubChannel.assertExchange(exchange, "x-delayed-message", { autoDelete: false, durable: true, passive: true, arguments: { 'x-delayed-type': "direct" } })
            //Bind the queue: "jobs" to the exchnage: "my-delay-exchange" with the binding key "jobs"
            pubChannel.bindQueue('jobs', exchange, 'jobs');

            while (true) {
                var m = offlinePubQueue.shift();
                if (!m) break;
                publish(m[0], m[1], m[2]);
            }


        }).finally(() => {
            //Tutup koneksi ke RabbitMQ setelah selesai menggunakan.
            setTimeout(function () { conn.close(); }, 500);
        })
    }).catch(console.warn)