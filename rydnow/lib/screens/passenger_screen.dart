import 'package:flutter/material.dart';
import 'package:google_place/google_place.dart';

class PassengerScreen extends StatefulWidget {
  const PassengerScreen({super.key});

  @override
  State<PassengerScreen> createState() => _PassengerScreenState();
}

class _PassengerScreenState extends State<PassengerScreen> {
  late GooglePlace googlePlace;
  List<AutocompletePrediction> predictions = [];

  @override
  void initState() {
    super.initState();

    // ✅ CORRECT initialization
    googlePlace = GooglePlace(
      'AIzaSyDfjCTcghGrXHoR6aWHMzBHQsnJa3vqhM0',
    );
  }

  void search(String value) async {
    if (value.isEmpty) {
      setState(() => predictions = []);
      return;
    }

    final result = await googlePlace.autocomplete.get(value);

    setState(() {
      predictions = result?.predictions ?? [];
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Passenger')),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            TextField(
              onChanged: search,
              decoration: const InputDecoration(
                labelText: 'Pickup or Destination',
              ),
            ),
            const SizedBox(height: 8),
            Expanded(
              child: ListView.builder(
                itemCount: predictions.length,
                itemBuilder: (context, index) {
                  final p = predictions[index];
                  return ListTile(
                    title: Text(p.description ?? ''),
                  );
                },
              ),
            ),
          ],
        ),
      ),
    );
  }
}
