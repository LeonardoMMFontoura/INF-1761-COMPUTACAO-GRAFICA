import numpy as np
from math import sin, cos, sqrt, radians
import sys

TOL = sys.float_info.epsilon
#print(TOL)

#VETOR
def vetor(x,y,z):
    return np.array([x,y,z],dtype=np.float64)

def ang(v1,v2):
    num = dot(v1,v2)
    den = norma(v1)*norma(v2)
    return np.arccos(num/den)*180/np.pi if den> TOLL else 0

def norma(v):
    return sqrt(v[0]*v[0]+v[1]*v[1]+v[2]*v[2])

def unitario(v):
    s = norma(v)
    if (s > TOL):
        return v/s
    else:
        return None
    
def dot(u,v):
    return (u[0]*v[0]+u[1]*v[1]+u[2]*v[2])

def reflete(v,n):
    r = 2*dot(v,n)*n-v
    return r

def cross(u,v): 
    return vetor(u[1]*v[2] - u[2]*v[1], u[2]*v[0] - u[0]*v[2], u[0]*v[1]-u[1]*v[0])


#Espaço projetivo ou homogeneo
def projetivo(x,y,z,w):
    return np.array([x,y,z,w],dtype=np.float64)

def to_cartesiano(vet4):
    if vet4[3]>TOL:
        return vetor(vet4[0]/vet4[3],vet4[1]/vet4[3],vet4[2]/vet4[3])
    #return vetor(0,0,0)
               
def to_projetivo(v):
    return projetivo(v[0],v[1],v[2],1)

# Transformações

#MATRIZ
def identidade():
    return np.eye(4,dtype=np.float64)

def translada(M,tx,ty,tz):
    T = np.eye(4,dtype=np.float64)
    T[0,3]=tx
    T[1,3]=tx
    T[2,3]=tx
    return np.dot(M,T)

def roda(M,ang, ex,ey,ez):
    norma = sqrt(ex*ex+ey*ey+ez*ez)
    R = np.eye(4,dtype=np.float64)
    if norma>TOL:
        ang = radians(teta)
        sin_a = sin(ang)
        cos_a = cos(ang)
        ex /= norma
        ey /= norma
        ez /= norma
        R[0,0]  = cos_a + (1 - cos_a)*ex*ex    
        R[0,1]  = ex*ey*(1 - cos_a) - ez*sin_a
        R[0,2]  = ez*ex*(1 - cos_a) + ey*sin_a
        R[1,0]  = ex*ey*(1 - cos_a) + ez*sin_a
        R[1,1]  = cos_a + (1 - cos_a)*ey*ey
        R[1,2]  = ey*ez*(1 - cos_a) - ex*sin_a
        R[2,0]  = ex*ez*(1 - cos_a) - ey*sin_a
        R[2,1]  = ey*ez*(1 - cos_a) + ex*sin_a
        R[2,2] = cos_a + (1 - cos_a)*ez*ez
    return np.dot(M,R)    

def mudanca_de_base(M, xe,ye,ze):
    R = np.eye(4,dtype=np.float64)
    R[0,:3] = xe
    R[1,:3] = ye
    R[2,:3] = ze
    return np.dot(M,R)

#Vetor homogeneo
def vetor4(x,y,w,z):
    return np.array([x,y,w,z],dtype=np.float64)

def cartesiano(vet4):
    if abs(vet4[3])>TOL:
        return vetor( vet4[0]/vet4[3], vet4[1]/vet4[3], vet4[2]/vet4[3])
    return None

def homogeneo(vet3):
    return np.array([vet3[0],vet3[1],vet3[2],1],dtype=np.float64)

def escala(M,sx,sy,sz):
    S = np.eye(4,dtype=np.float64)
    S[0,0]=sx
    S[1,1]=sy
    S[2,2]=sz
    return np.dot(M,S)

def translacao(tx,ty,tz):
    T = np.eye(4,dtype=np.float64)
    T[0,3]=tx
    T[1,3]=ty
    T[2,3]=tz
    return T

def rotacao(teta,ex,ey,ez):
    norma = sqrt(ex*ex+ey*ey+ez*ez)
    R = np.eye(4,dtype=np.float64)
    if norma > TOL:
        ang = radians(teta)
        sin_a = sin(ang)
        cos_a = cos(ang)
        ex /= norma
        ey /= norma
        ez /= norma
        
        r[0,0] = cos_a + (1 - cos_a)*ex*ex
        r[0,1] = ex*ey*(1 - cos_a) - ez*sin_a
        r[0,2] = ez*ey*(1 - cos_a) + ey*sin_a        
        
        R[1,0] = ex*ey*(1 - cos_a) + ez*sin_a
        R[1,1] = cos_a + (1 - cos_a) *ey*ey
        R[1,2] = ey*ez*(1 - cos_a) - ex*sin_a
        
        R[2,0] = ex*ez*(1 - cos_a) - ey*sin_a
        R[2,1] = ey*ez*(1 - cos_a) + ex*sin_a
        R[2,2] = cos_a + (1 - cos_a)*ez*ez
    return R
    
def matFromVet3(ex,ey,ez):
    M = np.eye(4,dtype=np.float64)
    M[0,:3]=ex
    M[1,:3]=ey
    M[2,:3]=ez
    return M