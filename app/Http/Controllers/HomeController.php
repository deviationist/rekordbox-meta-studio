<?php

namespace App\Http\Controllers;

use Inertia\Response;
use Laravel\Fortify\Features;

class HomeController extends Controller
{
    public function index(): Response
    {
        return inertia('welcome', [
            'canRegister' => Features::enabled(Features::registration()),
        ]);
    }
}
