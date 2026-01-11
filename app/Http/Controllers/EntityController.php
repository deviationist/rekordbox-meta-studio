<?php

namespace App\Http\Controllers;

use App\Services\EntityCountService;
use Illuminate\Http\JsonResponse;

class EntityController extends Controller
{
    public function __construct(
        protected EntityCountService $entityCountService
    ) {}

    public function index(): JsonResponse
    {
        return response()->json([
            'entityCount' => $this->entityCountService->getCounts(),
        ]);
    }
}
