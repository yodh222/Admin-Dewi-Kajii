@extends('template.sidebar')
@section('title','Ikan Hias')
@section('content')
<h1 class="fw-bold mt-4">Ikan Hias</h1>
<h3 class="fw-bold mt-5">Galeri Ikan Hias</h3>
<button type="button" class="btn btn-success mt-2">Tambah Ikan Hias</button>
<div class="image-container mt-4">
    <img src="{{asset('assets\image\kadal.jpg')}}" alt="Gambar" class="background-image">
    <div class="overlay">
        <h3 class="text-center">kadal gurun</h3>
        <div class="icon-container">
            <i class="fas fa-edit btn btn-primary btn-sm"></i>
            <i class="fas fa-trash-alt btn btn-danger btn-sm"></i>
        </div>
    </div>
</div>

<h3 class="fw-bold mt-5">Kolam Budi Daya Ikan</h3>
<button type="button" class="btn btn-success mt-2">Tambah Kolam</button>
<div class="image-container mt-4">
    <img src="{{asset('assets\image\kadal.jpg')}}" alt="Gambar" class="background-image">
    <div class="overlay">
        <h3 class="text-center">kadal gurun</h3>
        <div class="icon-container">
            <i class="fas fa-edit btn btn-primary btn-sm"></i>
            <i class="fas fa-trash-alt btn btn-danger btn-sm"></i>
        </div>
    </div>
</div>

<h3 class="fw-bold mt-5">Lembaga Kerjasama</h3>
<button type="button" class="btn btn-success mt-2">Tambah Lembaga</button>
<div class="image-container mt-4">
    <img src="{{asset('assets\image\kadal.jpg')}}" alt="Gambar" class="background-image">
    <div class="overlay">
        <h3 class="text-center">kadal gurun</h3>
        <div class="icon-container">
            <i class="fas fa-edit btn btn-primary btn-sm"></i>
            <i class="fas fa-trash-alt btn btn-danger btn-sm"></i>
        </div>
    </div>
</div>

@endsection