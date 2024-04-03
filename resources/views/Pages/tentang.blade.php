@extends('template.sidebar')
@section('title', 'Tentang Kami')
@section('content')
    <h1 class="fw-bold mt-5">Tentang Kami</h1>
    <h3 class="fw-bold mt-5">Profil Desa</h3>
    <div class="shadow-lg p-3 card">
        <p>Kadisoro, sebuah pedukuhan di Desa Gilangharjo, Bantul, Yogyakarta, memainkan peran penting dalam pengembangan sektor pariwisata. Fokusnya adalah pada pembangunan desa wisata, yang merupakan bagian integral dari konsep Pariwisata yang Berkelanjutan. Kami berusaha melibatkan masyarakat lokal sebagai pelaku utama. Sinergi antara Pengelola Desa Wisata dan Pokdarwis penting dalam menciptakan lingkungan pariwisata yang ramah dan bertanggung jawab, serta prinsip-prinsip Sapta Pesona yang kami jadikan sebagai landasan utama, yaitu aman, tertib, bersih, sejuk, indah, ramah tamah, dan kenangan.</p>
    </div>
    <div class="my-4 d-flex justify-content-end">
        <button type="button" class="btn btn-success">Simpan</button>
    </div>
    <h3 class="fw-bold mt-5">Timeline</h3>
    <button type="button" class="mb-3 btn btn-success">Tambah Timeline</button>
    <div class="shadow-lg p-3 card">
        <div class="my-1 d-flex justify-content-end">
            <button type="button" class="btn btn-danger"><i class="fa-solid fa-trash-can"></i></button>
            <button type="button" class="ms-2 btn btn-primary"><i class="fa-solid fa-pen-to-square"></i></button>
        </div>
        <span class="fs-6">Januari, 2019</span>
        <span class="mt-2 fw-bolder fs-4">Pembukaan Desa Wisata Kajii</span>
        <p>DESKRIPSI SINGKAT. Lorem ipsum dolor sit amet, consectetur adipiscing elit Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
        <img width="200" src="https://source.unsplash.com/random" alt="">
    </div>
@endsection
